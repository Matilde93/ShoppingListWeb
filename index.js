const baseUri = "https://shoppinglistweb.azurewebsites.net/api/items";

Vue.createApp({
  data() {
    return {
      id: "",
      name: "",
      quantity: "",
      unitType: "",
      category: "",
      items: [],
      error: "",
    };
  },
  async created() {
    console.log("created method called");
    try {
      const response = await axios.get(baseUri);
      this.items = await response.data;
      this.error = null;
    } catch (e) {
      this.items = [];
      this.error = e.message;
    }
  },
  methods: {
    async GetAll() {
      try {
        const response = await axios.get(baseUri);
        this.items = await response.data;
        this.error = null;
      } catch (e) {
        this.items = [];
        this.error = e.message;
      }
    },
    async AddItem(name, quantity, unitType, category) {
      id = 0;
      const newItem = { id: id, name: name, quantity: quantity, unitType: unitType, category: category };
      try {
        response = await axios.post(baseUri, newItem);
        this.items = await response.data;
        this.GetAll();
        this.name = "";
        this.quantity = "";
      } catch (ex) {
        alert(ex.message);
      }
    },
    async DeleteItem(id) {
      try {
        response = await axios.delete(baseUri + "/" + id);
        this.items = await response.data;
        this.GetAll();
      } catch (ex) {
        alert(ex.message);
      }
    },
    SortByName() {
      this.items.sort((item1, item2) => item1.name.localeCompare(item2.name));
    },
    SortByQuantityAscending() {
      this.items.sort((item1, item2) => item1.quantity - item2.quantity);
    },
    SortByQuantityDescending() {
      this.items.sort((item1, item2) => item2.quantity - item1.quantity);
    },
  },
}).mount("#app");
