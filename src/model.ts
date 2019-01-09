export type Member = {
    id_Line: string
    name_Line: string
    id_Game: string
    name_Game: string
    level: number
    remarks: string
    timestamp: number
}

export type User = {
    id: string
    name: string
    picUrl: string
    lineId: string
}