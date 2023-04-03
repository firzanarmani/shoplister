declare global {
  namespace Express {
    interface Request {
      email: string;
      name: string;
    }
  }
}

export {};
