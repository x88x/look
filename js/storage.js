Object.defineProperties(Storage.prototype, {
    getJson: {
        value: function (key, defaultValue) {
            try {
                return JSON.parse(this.getItem(key)) || defaultValue
            } catch (error) {
                return defaultValue
            }
        }
    },
    setJson: {
        value: function (key, value) {
            this.setItem(key, JSON.stringify(value))
        }
    }
})