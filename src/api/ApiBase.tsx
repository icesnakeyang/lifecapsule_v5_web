import axios from "axios";
export const Post = (api: String, params: any) => {
    let token = localStorage.getItem("lifecapsule_token") || "";
    return new Promise((resolve, reject) => {
        axios
            .post(`${api}`, params, {
                headers: {
                    token,
                },
            })
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const Get = (api: String) => {
    let token = localStorage.getItem("lifecapsule_token") || "";
    return new Promise((resolve, reject) => {
        axios
            .get(`${api}`, {
                headers: {
                    token,
                },
            })
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    }).catch((error) => {});
};
