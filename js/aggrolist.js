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
      // console.log(data);
      this.updated = true;
      this.combatants = [];

      for (const [key, value] of Object.entries(data.Combatant)) {
        var data = value;

        var apm = (data.swings + data.heals) / (data.DURATION / 60);

        if (apm < Infinity) {
          var player = {
            name: key,
            heals: data.heals,
            swings: data.swings,
            apm: apm.toFixed(1),
            estimate: data.DURATION < 60,
          };

          this.combatants.push(player);
        }
      }

      // console.log(this.combatants);

      // Sort by apm, descending
      this.combatants.sort((a, b) => b.apm - a.apm);
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
