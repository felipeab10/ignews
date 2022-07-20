import {NextApiRequest, NextApiResponse} from 'next';

export default (request:NextApiRequest,response:NextApiResponse) => {
    const users = [
        {id:1,name:'Felipe'},
        {id:2,name:'Fernando'},
        {id:3,name:'Maria'},
    ];
    return response.json(users);

}