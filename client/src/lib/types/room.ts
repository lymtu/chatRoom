export interface Room {
  id: string;
  name: string;
  status: 0 | 1; // 0: closed, 1: open
  wsUrl: string;
}
