const { ADMIN_PROFILE, DEFAULT_PROFILE } = require('./constants');

const PROFILES = {
  ADMIN: ADMIN_PROFILE,
  DEFAULT: DEFAULT_PROFILE,
};

module.exports = (userProfiles, profileToCheck) => {
  if (!userProfiles.length) return false;

  const hasSeachedProfile = userProfiles.some(
    (profile) => profile.id === PROFILES[profileToCheck.toUpperCase()],
  );

  return hasSeachedProfile;
};
