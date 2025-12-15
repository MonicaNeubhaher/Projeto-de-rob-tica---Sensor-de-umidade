import { GoogleGenAI, Chat } from "@google/genai";

const apiKey = process.env.API_KEY;

// Initialize the client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: apiKey });

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `Você é um especialista em Arduino e eletrônica embarcada, focado em ajudar estudantes e makers.
      
      Seu objetivo é explicar como funciona o sensor DHT11, como conectar jumpers no Arduino Uno e Protoboard, e como funciona o código C++.
      
      Mantenha suas respostas concisas, educativas e amigáveis. Use formatação Markdown para código e ênfase.
      Se o usuário perguntar sobre conexões, descreva claramente: VCC no 5V, GND no GND, Data no Pino Digital 2.
      `,
    },
  });
};

export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response = await chat.sendMessage({ message });
    return response.text || "Desculpe, não consegui processar sua resposta.";
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "Erro ao conectar com o assistente IA. Verifique sua chave de API.";
  }
};
