class Auth {
  constructor() {
    this.authenticated = false;
  }
  isAuthenticated() {
    const accessToken = sessionStorage.getItem("user");

    if (!accessToken) return (this.authenticated = false);

    if (accessToken) return (this.authenticated = true);
  }
}

export default new Auth();
