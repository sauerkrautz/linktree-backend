declare interface req {
  params?: any;
  body?: user;
}

declare interface user {
  email: string;
  password: string;
}

declare interface id {
  user: number;
}
