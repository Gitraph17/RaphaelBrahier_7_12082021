export const formControlMixins = {
  methods: {
    showInvalidMessages(e) {
      if ( ! e.target.validity.valid && e.target.value != "") {
        this.['showInvalid'+e.target.name] = true
      } 
    },

    hideInvalidMessages(e) {
      if (e.target.validity.valid || e.target.value === "") {
        this.['showInvalid'+e.target.name]= false
      }
    },

    submitBtnActivation() {
      let submitBtn = document.getElementById("submitBtn");
      submitBtn.disabled = true
      let invalidInputs = document.querySelectorAll(":invalid");
      if (invalidInputs.length === 0) {
        submitBtn.disabled = false
      }
    },

    onInput(e) {
      this.hideInvalidMessages(e)
      this.submitBtnActivation()
    },
  }
}
