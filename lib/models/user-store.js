// TODO: create proper User class

export default class UserStore {
  constructor({repository, onDidUpdate}) {
    this.repository = repository;
    this.onDidUpdate = onDidUpdate || (() => {});
    this.users = {};
    this.populate();
  }

  populate() {
    // TODO: check conditional branches
    // if repo present, get info
    if (this.repository.isPresent()) {
      this.loadUsers();
      // else, add listener to do so when repo is present
    } else {
      this.repository.onDidChangeState(({from, to}) => {
        if (!from.isPresent() && to.isPresent()) {
          this.loadUsers();
        }
      });
    }
  }

  loadUsers() {
    // TODO: also get users from GraphQL API if available. Will need to reshape the data accordingly
    // look into using Dexie
    this.loadUsersFromLocalRepo();
  }

  async loadUsersFromLocalRepo() {
    const users = await this.repository.getAuthors({max: 5000});
    this.addUsers(users);
  }

  addUsersFromGraphQL(response) {
    // this gets called in query renderer callback
    // this.addUsers(users);
  }

  addUsers(users) {
    this.users = {...this.users, ...users};
    this.didUpdate();
  }

  didUpdate() {
    this.onDidUpdate(this.getUsers());
  }

  getUsers() {
    // don't actually do this. will change when we settle on best way to actually store data
    return Object.keys(this.users)
      .map(email => ({email, name: this.users[email]}))
      .sort((a, b) => {
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
      });
  }
}

// class User {
//   constructor({email, name, githubLogin}) {
//
//   }
//
//   isGitHubUser() {
//     return !!this.githubLogin;
//   }
//
//   displayName() {
//     if (this.githubLogin) {
//       return `@${this.githubLogin}`;
//     } else {
//       return `${this.name}`;
//     }
//   }
//
//   coAuthorTrailer() {
//     return `Co-authored-by: ${this.email}`;
//   }
// }