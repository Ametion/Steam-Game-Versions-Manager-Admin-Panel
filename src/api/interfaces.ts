export interface GameResponse {
    gameId: string;
    gameImage: string;
    gameName: string;
    latestBuildId: string;
    updatedAt: string;
}

export interface Response {
    message: string;
    code: number;
}

export interface BuildResponse {
    id: number;
    buildId: string;
    inUse: boolean;
    isTested: boolean;
    gameId: any;
    gameName: string;
    lastModified: string;
    createdAt: Date;
    updatedAt: Date;
}