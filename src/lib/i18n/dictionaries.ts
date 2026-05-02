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
