"use strict";

let aggrolist = new Vue({
  el: "#aggrolist",
  data: {
    updated: false,
    locked: false,
    collapsed: false,
    combatants: null,
    hide: false,
  },
  attached: function () {
    window.addOverlayListener("CombatData", this.update);
    // window.addOverlayListener("PartyChanged", this.test);
    // window.addOverlayListener("LogLine", this.test);
    // window.addOverlayListener("EnmityAggroList", this.test);
    document.addEventListener("onOverlayStateUpdate", this.updateState);
    document.addEventListener("onExampleShowcase", this.showExample);
    window.startOverlayEvents();
  },
  detached: function () {
    window.removeOverlayListener("EnmityAggroList", this.update);
    document.removeEventListener("onOverlayStateUpdate", this.updateState);
  },
  methods: {
    test: function (data) {
      console.log(data);
    },
    update: function (data) {
      this.updated = true;
      this.combatants = [];

      for (const [key, value] of Object.entries(data.Combatant)) {
        var combatant = value;
        var duration = combatant.DURATION;
        var modifier = 1;

        if (combatant.DURATION < 60) {
          modifier = 60 / combatant.DURATION;
        } else {
          modifier = combatant.DURATION / 60;
        }

        var apm = combatant.swings * modifier / combatant.DURATION;

        if (apm < Infinity) {
          this.combatants.push({name: key, apm: apm.toFixed(1)});
        }

        console.log(this.combatants);
      }

      // Sort by apm, descending
      this.combatants.sort((a, b) => b.apm - a.apm)
    },
    updateState: function (e) {
      this.locked = e.detail.isLocked;
    },
    toggleCollapse: function () {
      this.collapsed = !this.collapsed;
    },
    showExample: function () {
      this.update({
        AggroList: [
          {
            isMe: false,
            isCurrentTarget: true,
            HateRate: 90,
            Name: "Tank",
            Job: "PLD",
            MaxHP: 100,
            CurrentHP: 3,
          },
          {
            isMe: false,
            isCurrentTarget: false,
            HateRate: 3,
            Name: "Off-Tank",
            Job: "WAR",
            MaxHP: 5000,
            CurrentHP: 4980,
          },
        ],
      });
    },
  },
});
