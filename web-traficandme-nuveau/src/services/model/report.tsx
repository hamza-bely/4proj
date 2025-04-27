
export interface Report {
    id: number
    type: string,
    latitude: number,
    longitude: number,
    user: string,
    createDate: string,
    updateDate: string,
    status: string,
    likeCount: number;
    dislikeCount: number;
    address : string
}


export interface ReportFetchResponse {
   message : string
   data : Report[]
}

export interface ReportDeleteResponse {
    message : string
    data : string
}

export interface ReportCreateRequest {
    id: number
    type: string,
    latitude: number,
    longitude: number,
    user: string,
    createDate: string,
    updateDate: string,
    status: number,
    likeCount: number;
    dislikeCount: number;
}

export interface ReportCreateResponse {
    id: number
    type: string,
    latitude: number,
    longitude: number,
    user: string,
    createDate: string,
    updateDate: string,
    status: number,
    likeCount: number;
    dislikeCount: number;
}

export interface ReportData {
    message: string;
    data:{
        type: string;
        count: number;
    }[];
}