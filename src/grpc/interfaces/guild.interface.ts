export interface GetGuildRequest {
  // Empty request as defined in the proto file
}

export interface GuildInfo {
  id: string;
  name: string;
  icon: string;
}

export interface GetGuildResponse {
  guilds: GuildInfo[];
}
