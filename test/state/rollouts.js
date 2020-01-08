import { expect } from 'chai';
import { useIsEnabledBasedOnOverrides } from 'State/rollouts';

describe('useIsEnabledBasedOnOverrides', function() {
  beforeEach(() => {
    this.togglesWhichRequireTeamMembership = ['specialProtectedFeature'];
    this.enabledOnOptimizely = false;
    this.overrides = {};
  });
  context("when the toggle is protected by team membership AND optimizely says it's enabled", () => {
    beforeEach(() => {
      this.enabledOnOptimizely = true;
    });
    it('is enabled when the override says so', () => {
      this.overrides.specialProtectedFeature = true;
      const enabled = useIsEnabledBasedOnOverrides({
        whichToggle: 'specialProtectedFeature',
        overrides: this.overrides,
        raw: this.enabledOnOptimizely,
        togglesWhichRequireTeamMembership: this.togglesWhichRequireTeamMembership,
      });
      expect(enabled).to.be.true;
    });
    it('is NOT enabled if it is not in the overrides', () => {
      this.overrides = {};
      const enabled = useIsEnabledBasedOnOverrides({
        whichToggle: 'specialProtectedFeature',
        overrides: this.overrides,
        raw: this.enabledOnOptimizely,
        togglesWhichRequireTeamMembership: this.togglesWhichRequireTeamMembership,
      });
      expect(enabled).to.be.false;
    });
  });

  context("when the toggle is protected by team membership AND optimizely says it's disabled", () => {
    beforeEach(() => {
      this.enabledOnOptimizely = false;
    });
    it('is NOT enabled even if the override says so', () => {
      this.overrides.specialProtectedFeature = true;
      const enabled = useIsEnabledBasedOnOverrides({
        whichToggle: 'specialProtectedFeature',
        overrides: this.overrides,
        raw: this.enabledOnOptimizely,
        togglesWhichRequireTeamMembership: this.togglesWhichRequireTeamMembership,
      });
      expect(enabled).to.be.false;
    });
  });

  context("when the toggle is NOT protected by team membership AND optimizely says it's disabled", () => {
    it('is enabled if optimizely says so', () => {
      this.enabledOnOptimizely = true;
      const enabled = useIsEnabledBasedOnOverrides({
        whichToggle: 'someOtherFeature',
        overrides: this.overrides,
        raw: this.enabledOnOptimizely,
        togglesWhichRequireTeamMembership: this.togglesWhichRequireTeamMembership,
      });
      expect(enabled).to.be.true;
    });

    it('is disabled if optimizely says so', () => {
      this.enabledOnOptimizely = false;
      const enabled = useIsEnabledBasedOnOverrides({
        whichToggle: 'someOtherFeature',
        overrides: this.overrides,
        raw: this.enabledOnOptimizely,
        togglesWhichRequireTeamMembership: this.togglesWhichRequireTeamMembership,
      });

      expect(enabled).to.be.false;
    });

    it('is enabled if the override says so', () => {
      this.overrides.someOtherFeature = true;
      const enabled = useIsEnabledBasedOnOverrides({
        whichToggle: 'someOtherFeature',
        overrides: this.overrides,
        raw: this.enabledOnOptimizely,
        togglesWhichRequireTeamMembership: this.togglesWhichRequireTeamMembership,
      });

      expect(enabled).to.be.true;
    });

    it('is disabled if the override says so', () => {
      this.overrides.someOtherFeature = false;
      this.enabledOnOptimizely = true;
      const enabled = useIsEnabledBasedOnOverrides({
        whichToggle: 'someOtherFeature',
        overrides: this.overrides,
        raw: this.enabledOnOptimizely,
        togglesWhichRequireTeamMembership: this.togglesWhichRequireTeamMembership,
      });
      expect(enabled).to.be.false;
    });
  });
});
