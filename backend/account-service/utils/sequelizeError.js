// Utilitaire pour extraire un message d'erreur explicite depuis une erreur Sequelize
function getSequelizeErrorMessage(err) {
  if (err.name === 'SequelizeUniqueConstraintError') {
    // On récupère le champ en cause
    const field = err.errors && err.errors[0] && err.errors[0].path;
    switch (field) {
      case 'email': return 'Email déjà utilisé.';
      case 'username': return 'Nom d’utilisateur déjà utilisé.';
      case 'code': return 'Code déjà utilisé.';
      default: return 'Valeur déjà utilisée.';
    }
  }
  return null;
}

module.exports = getSequelizeErrorMessage;
