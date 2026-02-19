import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface parsedDataProps {
  name: string;
  email: string;
  phone: string;
  linkedIn: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Pdf = Buffer.from(arrayBuffer).toString("base64");
    // const nowData = new Date(Date.now()).toISOString();

    const prompt = `
Extract the following information from the attached PDF resume:
- Full name
- Email address
- Phone number: (add country code if not written)
- LinkedIn url (if available and https:// if not added with url in pdf)

{
  "name": "...",
  "email": "...",
  "phone": "...",
  "linkedIn": "...",
}
    `;

    const contents = [
      {
        text: prompt,
      },
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64Pdf,
        },
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        temperature: 0,
      },
    });

    // Attempt to parse JSON response
    let parsedData: parsedDataProps = {
      name: "",
      email: "",
      phone: "",
      linkedIn: "",
    };
    try {
      const textContent =
        response.candidates?.[0]?.content?.parts?.[0]?.text ||
        response.text ||
        "";


      // --- Try to extract JSON from the response ---
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonString = jsonMatch[0];
        parsedData = JSON.parse(jsonString);
      }
    } catch (parseError) {
      console.error("Failed to parse response:", parseError);
    }

    return NextResponse.json({ parsed: parsedData });
  } catch (error: unknown) {
    console.error("Gemini PDF parsing error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: "Failed to parse PDF",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
