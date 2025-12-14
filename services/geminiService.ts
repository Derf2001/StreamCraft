import { GoogleGenAI } from "@google/genai";
import { GenerationConfig, PortraitConfig, RemoveBgConfig, EmoteStyle, EmoteEmotion, PortraitStyle, BackgroundOption } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateEmote = async (config: GenerationConfig): Promise<string> => {
  try {
    const { imageBase64, style, emotion, prompt } = config;
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

    const isCustomStyle = style === EmoteStyle.NONE;

    // Logic to handle "None" selection for Emotes
    const styleInstruction = isCustomStyle
      ? "MANTÉN EL ESTILO VISUAL EXACTO DE LA IMAGEN ORIGINAL. Si es una fotografía, que siga pareciendo una fotografía. Si es un dibujo, mantén ese estilo. NO apliques filtros de 'cartoon' o 'vector' a menos que se pida en las instrucciones extra." 
      : `Aplica fuertemente el estilo artístico: ${style}`;

    const technicalRequirements = isCustomStyle
      ? `
      1. Recorte (Crop): Haz zoom agresivo en la cara o sujeto principal para maximizar el espacio en el lienzo cuadrado.
      2. Fondo: Elimina el fondo original y sustitúyelo por transparencia o un color sólido vibrante solo si mejora la visibilidad.
      3. Expresión: Modifica la cara para reflejar la emoción '${emotion}' de forma natural (photobashing style), sin romper el realismo o estilo original de la imagen.
      4. Legibilidad: Aumenta el contraste y brillo para que se entienda bien en tamaño pequeño (28px).`
      : `
      1. Estilo Visual: Simplifica los detalles, usa líneas gruesas y colores planos (estilo sticker/vector).
      2. Fondo: Sólido o transparente, limpio.
      3. Composición: Cabeza grande, cuerpo pequeño o inexistente. Zoom máximo en la expresión.
      4. Expresión: Exagerada y caricaturesca para la emoción '${emotion}'.`;

    const finalPrompt = `
      Actúa como un diseñador gráfico experto en Twitch.
      Transforma la imagen de referencia adjunta en un Emote de Twitch profesional.
      
      Detalles del pedido:
      - Instrucción de Estilo: ${styleInstruction}
      - Emoción solicitada: ${emotion}
      - Instrucciones extra del usuario: ${prompt}

      Requisitos técnicos CRÍTICOS:
      ${technicalRequirements}
      5. No incluyas texto pequeño.
      
      Genera solo la imagen del emote final.
    `;

    return await callGemini(finalPrompt, cleanBase64);
  } catch (error) {
    console.error("Error generating emote:", error);
    throw error;
  }
};

export const generatePortrait = async (config: PortraitConfig): Promise<string> => {
  try {
    const { imageBase64, style, prompt } = config;
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

    const finalPrompt = `
      Actúa como un artista digital profesional de clase mundial.
      Tu tarea es transformar la foto proporcionada en una ilustración artística de alta calidad ("Tu versión dibujo").
      
      Estilo solicitado: ${style}
      Instrucciones adicionales: ${prompt}

      Instrucciones de Estilo Específicas:
      ${getStyleInstructions(style)}

      Requisitos Generales:
      1. Mantén los rasgos faciales clave y la identidad de la persona, pero adáptalos completamente al estilo artístico elegido (si se eligió uno).
      2. La composición debe ser estéticamente agradable, adecuada para una foto de perfil o avatar.
      3. Iluminación y colores de alta calidad profesional.
      4. Si es estilo GTA, usa el clásico sombreado cel-shading y bordes definidos.
      5. Si es estilo Disney/Pixar, usa renderizado 3D suave, ojos expresivos y cálida iluminación.
      
      Genera solo la ilustración.
    `;

    return await callGemini(finalPrompt, cleanBase64);
  } catch (error) {
    console.error("Error generating portrait:", error);
    throw error;
  }
};

export const removeBackground = async (config: RemoveBgConfig): Promise<string> => {
  try {
    const { imageBase64, background, prompt } = config;
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

    const bgInstruction = getBackgroundInstruction(background);

    const finalPrompt = `
      Actúa como un editor de fotos experto con herramientas de IA.
      Tu tarea es AISLAR AL SUJETO PRINCIPAL (Persona, Mascota u Objeto) de la imagen y colocarlo sobre un nuevo fondo.
      
      Configuración de Fondo: ${bgInstruction}
      Instrucciones Adicionales: ${prompt}

      REGLAS ESTRICTAS:
      1. IDENTIDAD: El sujeto principal debe verse IDÉNTICO al original. NO lo caricaturices ni cambies su estilo artístico. Mantén el fotorrealismo si es una foto.
      2. RECORTES: Los bordes del sujeto deben ser limpios y precisos.
      3. ILUMINACIÓN: Ajusta sutilmente la iluminación del sujeto para que encaje mejor con el nuevo fondo solicitado, pero sin perder su esencia.
      4. Si se pide Transparente/Verde/Blanco: El objetivo es la utilidad (sticker/png).
      5. Si se pide un fondo artístico (Cyberpunk, Naturaleza): Integra al sujeto de forma realista en el entorno.

      Genera la imagen con el sujeto aislado en el fondo solicitado.
    `;

    return await callGemini(finalPrompt, cleanBase64);
  } catch (error) {
    console.error("Error removing background:", error);
    throw error;
  }
};

const getBackgroundInstruction = (option: BackgroundOption): string => {
  switch (option) {
    case BackgroundOption.TRANSPARENT: return "Fondo TOTALMENTE TRANSPARENTE o Blanco Puro si no puedes generar alpha. Prioriza aislar el objeto perfectamente.";
    case BackgroundOption.WHITE: return "Fondo BLANCO PURO (Hex #FFFFFF). Estilo fotografía de producto o carnet.";
    case BackgroundOption.BLACK: return "Fondo NEGRO PURO (Hex #000000). Estilo elegante o dark mode.";
    case BackgroundOption.GREEN: return "Fondo VERDE CHROMA KEY (Hex #00FF00). Verde brillante plano para facilitar la edición de video.";
    case BackgroundOption.CYBERPUNK: return "Fondo Urbano Futurista estilo Cyberpunk. Luces de neón, noche lluviosa, desenfoque bokeh.";
    case BackgroundOption.STUDIO: return "Fondo de Estudio Fotográfico Profesional. Gris neutro con iluminación de tres puntos suave.";
    case BackgroundOption.NATURE: return "Fondo de Bosque Natural o Paisaje suavemente desenfocado para resaltar al sujeto.";
    default: return "Fondo limpio y sólido que resalte al sujeto.";
  }
}

const getStyleInstructions = (style: PortraitStyle): string => {
  switch (style) {
    case PortraitStyle.NONE: return "No apliques un filtro de estilo predefinido. Sigue estrictamente las instrucciones adicionales del usuario para definir el estilo visual. Si el usuario no especifica estilo en el texto, mejora la calidad de la imagen original manteniéndola realista o fiel a su origen, pero con un acabado artístico de alta gama.";
    case PortraitStyle.GTA: return "Usa el estilo de arte de pantalla de carga de Grand Theft Auto. Sombreado duro, colores saturados, contornos negros definidos, vibra cool y peligrosa.";
    case PortraitStyle.DISNEY_3D: return "Estilo de película de animación 3D moderna (Pixar/Disney). Texturas suaves, iluminación cinemática, ojos grandes y expresivos, adorable.";
    case PortraitStyle.SIMPSONS: return "Estilo de dibujos animados de Los Simpsons. Piel amarilla, ojos grandes circulares, contornos simples, estilo Matt Groening.";
    case PortraitStyle.ANIME: return "Estilo Anime japonés de alta calidad. Ojos detallados, cabello estilizado, efectos dramáticos de luz, estilo Shonen o Shojo moderno.";
    case PortraitStyle.GHIBLI: return "Estilo Studio Ghibli (Hayao Miyazaki). Colores vibrantes pero naturales, fondos detallados pintados a mano, personajes con rasgos suaves y expresivos, atmósfera mágica y nostálgica.";
    case PortraitStyle.CHIBI: return "Estilo Chibi/Kawaii. Cabezas grandes (deformed), cuerpos pequeños, ojos enormes y brillantes, mejillas sonrojadas, extremadamente tierno y simplificado.";
    case PortraitStyle.MANGA: return "Estilo Manga tradicional japonés. Blanco y negro, uso de tramas (screentones), entintado dinámico, alto contraste, estilo cómic impreso.";
    case PortraitStyle.PIXEL_ART: return "Pixel Art de alta calidad. Estilo retro de videojuegos de 16-bits, paleta de colores limitada, sombreado dithered.";
    case PortraitStyle.VECTOR: return "Arte Vectorial limpio. Líneas nítidas, formas geométricas definidas, colores sólidos vibrantes, sin degradados complejos, estilo Adobe Illustrator.";
    case PortraitStyle.FLAT_DESIGN: return "Flat Design moderno. Minimalista, bidimensional, colores sólidos brillantes, formas simplificadas, sin texturas ni sombras complejas, estilo corporativo tech.";
    case PortraitStyle.CHILDLIKE: return "Ilustración de libro de cuentos infantil. Estilo dibujo con crayón, acuarela suave o lápiz de color, trazos inocentes, colores pasteles, soñador y caprichoso.";
    case PortraitStyle.FANTASY: return "Arte de Fantasía Épica. Estilo Dungeons & Dragons o Magic The Gathering. Iluminación mágica, armaduras detalladas, atmósfera etérea y heroica.";
    case PortraitStyle.CONCEPT_ART: return "Concept Art para videojuegos AAA. Pinceladas digitales visibles pero detalladas (digital painting), iluminación dramática, diseño de personajes fuerte, fondo atmosférico.";
    default: return "Asegúrate de que el estilo artístico sea muy evidente, estilizado y de alta calidad.";
  }
};

const callGemini = async (prompt: string, base64Data: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: prompt },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data
          }
        }
      ]
    }
  });

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) throw new Error("No se generó contenido.");

  for (const part of parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("La API no devolvió una imagen válida.");
};