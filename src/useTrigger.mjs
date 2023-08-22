import useSWRMutation from "swr/mutation"
import { mutate } from "swr"

export default function useTrigger(
  endpoint,
  method,
  store,
  onSuccess = (data) => console.log(data),
  onError = (error) => console.log(error)
) {
  async function fetcher(url, { arg }) {
    const req = await fetch(
      url,
      method != "GET"
        ? {
            method: method,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(arg),
          }
        : {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
    )
    return req.json()
  }

  const { trigger } = useSWRMutation(endpoint, fetcher, {
    onSuccess: (data) => {
      if (data.success === "success") {
        onSuccess(data)
        if (store) {
          mutate(store)
        }
      } else {
        onError(data)
      }
    },
    onError: (data) => {
      if (data.success === "success") {
        onSuccess(data)
      } else {
        onError(data)
      }
    },
  })

  return { trigger }
}