export enum EmoteStyle {
  NONE = 'Ninguno / Personalizado',
  CARTOON = 'Cartoon Vectorial',
  PIXEL_ART = 'Pixel Art',
  ANIME = 'Anime Chibi',
  REALISTIC = 'Semi-Realista 3D',
  MEME = 'Estilo Meme'
}

export enum PortraitStyle {
  NONE = 'Ninguno / Personalizado',
  DISNEY_3D = 'Estilo Disney/Pixar 3D',
  ANIME = 'Anime Japonés Épico',
  GTA = 'Estilo GTA (Grand Theft Auto)',
  SIMPSONS = 'Estilo Amarillo (Simpsons)',
  GHIBLI = 'Estilo Studio Ghibli',
  CHIBI = 'Chibi / Kawaii',
  MANGA = 'Manga Blanco y Negro',
  COMIC = 'Comic Americano Vintage',
  PIXEL_ART = 'Pixel Art Retro',
  VECTOR = 'Arte Vectorial Plano',
  FLAT_DESIGN = 'Flat Design Minimalista',
  CHILDLIKE = 'Cuento Infantil / Crayon',
  FANTASY = 'Fantasía Épica RPG',
  CONCEPT_ART = 'Concept Art Videojuego',
  CYBERPUNK = 'Cyberpunk Futurista',
  SKETCH = 'Boceto a Lápiz Artístico',
  OIL_PAINTING = 'Pintura al Óleo Clásica'
}

export enum BackgroundOption {
  TRANSPARENT = 'Fondo Transparente (Intento IA)',
  WHITE = 'Fondo Blanco (Producto)',
  BLACK = 'Fondo Negro (Dark Mode)',
  GREEN = 'Pantalla Verde (Chroma Key)',
  CYBERPUNK = 'Fondo Neon/Cyberpunk',
  STUDIO = 'Fondo Estudio Fotográfico',
  NATURE = 'Fondo Naturaleza/Bosque'
}

export enum EmoteEmotion {
  HYPE = 'Hype / Emocionado',
  ANGRY = 'Enojado / Rage',
  SAD = 'Triste / Cry',
  LAUGHING = 'Risa / LUL',
  COOL = 'Cool / Gafas de sol',
  LOVE = 'Amor / Corazones',
  SHOCKED = 'Sorprendido / Pog'
}

export interface GenerationConfig {
  prompt: string;
  style: EmoteStyle;
  emotion: EmoteEmotion;
  imageBase64: string;
}

export interface PortraitConfig {
  prompt: string;
  style: PortraitStyle;
  imageBase64: string;
}

export interface RemoveBgConfig {
  prompt: string;
  background: BackgroundOption;
  imageBase64: string;
}

export interface GeneratedEmote {
  imageUrl: string;
  timestamp: number;
}