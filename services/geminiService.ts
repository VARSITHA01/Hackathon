import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { FormData, PredictionResultData, SubsidiesAndMarketsData } from '../types';

// Fix: Aligned with Gemini API guidelines by removing the 'as string' type assertion for the API key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

export const getCropSuggestion = async (formData: FormData, language: string): Promise<PredictionResultData> => {
    const schema = {
        type: Type.OBJECT,
        properties: {
            cropName: { type: Type.STRING, description: "The common name of the suggested crop." },
            reasoning: { type: Type.STRING, description: "A brief explanation for why this crop is suitable." },
            predictedYield: { type: Type.STRING, description: "The estimated yield in kilograms per hectare (kg/ha)." },
            estimatedProfit: { type: Type.STRING, description: "A rough estimate of the potential profit in USD per hectare." },
            cropDescription: { type: Type.STRING, description: "A short, engaging description of the crop." },
        },
        required: ["cropName", "reasoning", "predictedYield", "estimatedProfit", "cropDescription"],
    };

    const systemInstruction = `You are an expert agricultural advisor. Based on the provided soil and climate data, suggest the best crop to grow. Predict its yield, estimate the profit, and provide a brief description. Respond ONLY with a valid JSON object matching the provided schema. The response language should be ${language}.`;
    const prompt = `Here is the farm data: ${JSON.stringify(formData)}. Provide a crop suggestion.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { systemInstruction, responseMimeType: "application/json", responseSchema: schema },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as PredictionResultData;
    } catch (error) {
        console.error("Error fetching crop suggestion:", error);
        throw new Error("Failed to get crop suggestion from Gemini API.");
    }
};

export const getCropImage = async (cropName: string): Promise<string> => {
    const imageModel = 'imagen-4.0-generate-001';
    const prompt = `A vibrant, high-quality photograph of a healthy ${cropName} plant in a flourishing field, under a clear sunny sky. Realistic photo.`;
    
    try {
        const response = await ai.models.generateImages({
            model: imageModel,
            prompt,
            config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '16:9' },
        });

        if (response.generatedImages?.length > 0) {
            return `data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`;
        }
        throw new Error("No image was generated.");
    } catch (error) {
        console.error("Error generating crop image:", error);
        return `https://picsum.photos/seed/${encodeURIComponent(cropName)}/1200/675`;
    }
};

export const getWeatherAndParse = async (coords: { latitude: number, longitude: number }, language: string): Promise<{ temperature: string, humidity: string, rainfall: string }> => {
    const schema = {
        type: Type.OBJECT,
        properties: {
            temperature: { type: Type.STRING, description: "Current temperature in Celsius (number only)." },
            humidity: { type: Type.STRING, description: "Current humidity percentage (number only)." },
            rainfall: { type: Type.STRING, description: "Today's predicted rainfall in mm (number only). If no rainfall is expected, this should be '0'." },
        },
        required: ["temperature", "humidity", "rainfall"],
    };
    const systemInstruction = `You are a weather data provider. Based on the user's geo-coordinates, provide the current weather data as numbers only, without any units or symbols (like °C, %, or mm). Respond ONLY with a valid JSON object matching the provided schema. The response language should be ${language}.`;
    const prompt = `Coordinates: latitude=${coords.latitude}, longitude=${coords.longitude}.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { systemInstruction, responseMimeType: "application/json", responseSchema: schema },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw new Error("Failed to get weather data from Gemini API.");
    }
};

export const parseVoiceInput = async (transcript: string, language: string): Promise<Partial<FormData>> => {
    const schema = {
        type: Type.OBJECT,
        properties: {
            N: { type: Type.STRING }, P: { type: Type.STRING }, K: { type: Type.STRING },
            temperature: { type: Type.STRING }, humidity: { type: Type.STRING },
            ph: { type: Type.STRING }, rainfall: { type: Type.STRING },
        },
    };
    const systemInstruction = `You are an expert at parsing unstructured text into structured data. Extract the values for N, P, K, temperature, humidity, ph, and rainfall from the user's voice transcript. Ignore units. If a value is not mentioned, omit the key. Respond ONLY with a valid JSON object. The response language should be ${language}.`;
    const prompt = `Transcript: "${transcript}"`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { systemInstruction, responseMimeType: "application/json", responseSchema: schema },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error parsing voice input:", error);
        throw new Error("Failed to parse voice input with Gemini API.");
    }
};

export const createChat = (language: string): Chat => {
    const systemInstruction = `You are AgroGenius, a friendly and knowledgeable AI assistant for farmers. Your goal is to provide helpful, accurate, and concise information about agriculture. Answer questions about crops, soil health, pest control, farming techniques, and market trends. Your responses should be in the user's language, which is: ${language}.`;
    
    return ai.chats.create({
      model,
      config: { systemInstruction },
    });
};

export const getSubsidiesAndMarkets = async (coords: { latitude: number, longitude: number }, language: string): Promise<SubsidiesAndMarketsData> => {
    const schema = {
        type: Type.OBJECT,
        properties: {
            centralSubsidies: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        description: { type: Type.STRING },
                        eligibility: { type: Type.STRING },
                        link: { type: Type.STRING },
                    },
                    required: ["name", "description", "eligibility", "link"],
                },
            },
            stateSubsidies: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        description: { type: Type.STRING },
                        eligibility: { type: Type.STRING },
                        link: { type: Type.STRING },
                    },
                    required: ["name", "description", "eligibility", "link"],
                },
            },
            localMarkets: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        location: { type: Type.STRING },
                        commodities: { type: Type.STRING },
                    },
                    required: ["name", "location", "commodities"],
                },
            },
        },
        required: ["centralSubsidies", "stateSubsidies", "localMarkets"],
    };

    const systemInstruction = `You are an Indian agricultural information specialist. Based on the provided geo-coordinates, identify the Indian state. Then, find relevant information for farmers in that location.
1.  List 2-3 key, currently active Central Government agricultural subsidies.
2.  List 2-3 key, currently active State-specific Government agricultural subsidies for that state.
3.  List 3-5 major nearby agricultural markets (mandis).
Provide real, accurate, and up-to-date information. For subsidies, provide a real, official government link. Respond ONLY with a valid JSON object matching the schema. The response language should be ${language}.`;
    const prompt = `My location is: latitude=${coords.latitude}, longitude=${coords.longitude}. Provide a list of subsidies and nearby markets.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { systemInstruction, responseMimeType: "application/json", responseSchema: schema },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error fetching subsidies and markets:", error);
        throw new Error("Failed to get subsidies and markets from Gemini API.");
    }
};