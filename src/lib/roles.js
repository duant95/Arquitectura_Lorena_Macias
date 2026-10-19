// Roles del panel (ver scripts/migracion-admins.sql). Sin dependencias de
// servidor: se puede importar desde componentes de cliente.
//   duena   → todo, incluido eliminar y gestionar usuarios
//   editora → crear y editar (no elimina)
export const ROL_DUENA = 'duena';
export const ROL_EDITORA = 'editora';

export const ROL_LABEL = { [ROL_DUENA]: 'Dueña', [ROL_EDITORA]: 'Editora' };
