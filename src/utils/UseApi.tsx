import axios from 'axios'
import { useCallback } from 'react'

function UseApi() {
  const url = process.env.REACT_APP_API_URL

  interface methodParams {
    path: any
    body?: any
    id?: any
    params?: any
    refetch?: boolean
  }
  interface fetchNamedParams {
    apiUrl: any
    method?: string
    body?: any
    params?: any
    refetch?: boolean
  }
  const customFetch: any = useCallback(
    ({ apiUrl, method = 'get', body, params, refetch }: fetchNamedParams) => {
      return axios({
        method: method,
        url: apiUrl,
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:8100',
        },
        data: body,
        params: params,
        withCredentials: true,
      })
        .then((response) => {
          if (refetch) return customFetch({ apiUrl: url, refetch: false })
          else return response.data
        })
        .catch((err) => {
          return err
        })
    },
    [url]
  )

  const post = ({ path, body, refetch = false }: methodParams) => {
    return customFetch({
      apiUrl: `${url}/${path}`,
      method: 'post',
      body: body,
      refetch: refetch,
    })
  }

  const put = ({ path, id, body, refetch = false }: methodParams) => {
    return customFetch({
      apiUrl: `${url}/${path}/${id}`,
      method: 'put',
      body: body,
      refetch: refetch,
    })
  }

  const remove = ({ path, id, refetch = false }: methodParams) => {
    return customFetch({
      apiUrl: `${url}/${path}/${id !== undefined ? `/${id}` : ``}`,
      method: 'delete',
      refetch: refetch,
    })
  }

  const get = ({ path, id, params, refetch = false }: methodParams) => {
    return customFetch({
      apiUrl: `${url}${path}${id !== undefined ? `/${id}` : ``}`,
      method: 'get',
      params: params,
      refetch: refetch,
    })
  }

  return { post, remove, put, get }
}

export default UseApi
