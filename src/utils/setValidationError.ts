import { DynamicObject } from "@/types/dynamic.type"
import { UseFormSetError } from "react-hook-form"

export const setValidationError = (requestValues: DynamicObject, setError: UseFormSetError<any>) => {
    console.log(requestValues)
    Object.keys(requestValues).map((error) => {
        // TODO: エラーメッセージが複数あった場合に続けて表示される
        setError(error, {message: requestValues[error]})
    })
}
