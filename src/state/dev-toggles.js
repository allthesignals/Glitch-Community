import useUserPref from './user-prefs';
// NOTE! Dev Toggles are going away, plz consider using useFeatureEnabled in State/rollouts instead

//  Dev Toggles!
//
//   Use dev toggles to parts of the site that are still in development.
//   This site is open source, there's no utility here, this is just a way to help us
//   ship things _extra_ early without impacting customer UX
//

// Define your dev toggles here.
// We can only have three... err ok four.
// Users can enable them with the /secret page.
const toggleData = [
  {
    name: 'User Passwords',
    description: 'Enable users to set a password for their account',
  },
  {
    name: 'Two Factor Auth',
    description: 'Allow users to enable two factor authentication',
  },
  {
    name: 'Account Deletion',
    description: 'Enable users to delete their account without Glitch staff intervention',
  },
].slice(0, 4); // <-- Yeah really, only 3...or rather 4.  If you need more, clean up one first.

// Usage:
//
// import useDevToggle from 'State/dev-toggles`
//
// const NewFeatureIfEnabled = () => {
//   const showNewFeature = useDevToggle('New Feature');
//   return showNewFeature ? <NewFeature /> : null;
// };

export const useDevToggles = () => {
  const [enabledToggles, setEnabledToggles] = useUserPref('devToggles', []);
  return { enabledToggles, toggleData, setEnabledToggles };
};

const useDevToggle = (toggle) => {
  const { enabledToggles } = useDevToggles();
  return enabledToggles.includes(toggle);
};

export default useDevToggle;
