export type Dictionary = typeof es;

export const es = {
  nav: {
    home: "Inicio",
    explore: "Explorar",
    groups: "Grupos",
    profile: "Perfil"
  },
  profile: {
    title: "Mi perfil",
    edit: "Editar",
    cancel: "Cancelar",
    save: "Guardar cambios",
    pseudonym: "Seudónimo",
    bio: "Biografía",
    language: "Idioma de la app",
    streak: "Racha",
    points: "Puntos",
    badges: "Logros",
    recognitions: "Reconocimientos",
    settings: "Ajustes",
    contribute: "Contribuir al proyecto",
    logout: "Cerrar sesión",
    photoUpdated: "Foto actualizada",
    profileUpdated: "Perfil actualizado",
    errorImage: "Error al subir la imagen",
    noBio: "Sin biografía"
  },
  group: {
    newGroup: "Nuevo grupo",
    join: "Unirse",
    create: "Crear",
    groupName: "Nombre del grupo",
    description: "Descripción",
    groupIcon: "Icono del grupo",
    language: "Idioma de las preguntas",
    createBtn: "Crear Grupo",
    joinByCode: "Unirse por código",
    enterCode: "Introduce los 6 caracteres que te ha pasado el admin del grupo.",
    joinBtn: "Unirse Ahora"
  },
  landing: {
    hero: {
      badge: "Gratis con anuncios · Sin tarjeta",
      title: "Conoce a tus amigos",
      titleAccent: "de verdad.",
      desc: "Preguntas diarias que exponen lo que tu grupo realmente piensa. Divertido. Honesto. Ligeramente incómodo.",
      ctaApp: "App Store",
      ctaGoogle: "Google Play"
    },
    features: {
      title: "Cómo funciona",
      desc: "Tres pasos para descubrir lo que tus amigos realmente piensan de ti.",
      step1: { title: "Crea o únete a un grupo", desc: "Crea un grupo o únete con un código. Tu equipo estará listo en segundos." },
      step2: { title: "Responde preguntas diarias", desc: "Cada día cae una nueva pregunta. Responde con honestidad — sin filtros." },
      step3: { title: "Sube en el ranking", desc: "Gana puntos, racha y mira quién conoce mejor al grupo." }
    },
    cta: {
      title: "¿Listo para descubrirlo?",
      desc: "Únete a miles de grupos de amigos que ya están auditando sus amistades.",
      input: "tu@email.com",
      btn: "Acceso anticipado",
      success: "¡Estás en la lista!",
      successDesc: "Te avisaremos cuando sea tu turno."
    }
  }
};

export const en: Dictionary = {
  nav: {
    home: "Home",
    explore: "Explore",
    groups: "Groups",
    profile: "Profile"
  },
  profile: {
    title: "My Profile",
    edit: "Edit",
    cancel: "Cancel",
    save: "Save changes",
    pseudonym: "Pseudonym",
    bio: "Bio",
    language: "App Language",
    streak: "Streak",
    points: "Points",
    badges: "Badges",
    recognitions: "Recognitions",
    settings: "Settings",
    contribute: "Contribute to project",
    logout: "Log out",
    photoUpdated: "Photo updated",
    profileUpdated: "Profile updated",
    errorImage: "Error uploading image",
    noBio: "No bio"
  },
  group: {
    newGroup: "New group",
    join: "Join",
    create: "Create",
    groupName: "Group name",
    description: "Description",
    groupIcon: "Group icon",
    language: "Question language",
    createBtn: "Create Group",
    joinByCode: "Join by code",
    enterCode: "Enter the 6-character code given by the group admin.",
    joinBtn: "Join Now"
  },
  landing: {
    hero: {
      badge: "Free with ads · No credit card",
      title: "Know your friends",
      titleAccent: "for real.",
      desc: "Daily questions that expose what your group really thinks. Fun. Honest. Slightly uncomfortable.",
      ctaApp: "App Store",
      ctaGoogle: "Google Play"
    },
    features: {
      title: "How it works",
      desc: "Three steps to discovering what your friends really think about you.",
      step1: { title: "Create or join a group", desc: "Start a group or join with a code. Your squad is ready in seconds." },
      step2: { title: "Answer daily questions", desc: "Every day a new question drops. Answer honestly — no filter." },
      step3: { title: "Climb the leaderboard", desc: "Earn points, build streaks, and see who truly knows the group best." }
    },
    cta: {
      title: "Ready to find out?",
      desc: "Join thousands of friend groups already auditing their friendships.",
      input: "your@email.com",
      btn: "Get early access",
      success: "You're on the list!",
      successDesc: "We'll email you when it's your turn."
    }
  }
};

export const dictionaries: Record<string, Dictionary> = {
  es,
  'es-MX': es,
  en,
  'en-UK': en,
  // Fallbacks for now
  de: en,
  fr: en,
  it: es,
  pt: es,
};
