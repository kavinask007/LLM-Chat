
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/6K7RUDfhNrx
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { SetStateAction, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
interface Model {
  model_id: string;
}
export  function ModelSelector() {
  const [apiEndpoint, setApiEndpoint] = useState("https://api.openai.com")
  const [accessToken, setAccessToken] = useState("")
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    if (!apiEndpoint || !accessToken) {
      setIsLoading(false)
      return
    }
    try {
      const response = await fetch(apiEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        throw new Error("Error fetching models")
      }
      const data = await response.json()
      console.log(data)
      setModels(data.data.map((item: { id: any }) => ({ model_id: item.id }))
)
    } catch (error) {
      console.error("Error fetching models:", error)
      setError("Error fetching models. Please check your API endpoint and access token.")
    } finally {
      setIsLoading(false)
    }
  }
  const handleModelSelect = (model: SetStateAction<Model|null>) => {
    setSelectedModel(model)
  }
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>OpenAI API Configuration</CardTitle>
        <CardDescription>Enter your API endpoint and access token to list available models.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiEndpoint">API Endpoint</Label>
            <Input
              id="apiEndpoint"
              placeholder="https://api.openai.com"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accessToken">Access Token</Label>
            <Input
              id="accessToken"
              type="password"
              placeholder="sk-xxxxxxxxxxxxxxxxxx"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
            />
          </div>
          <Button  type="submit" className="w-full" disabled={!apiEndpoint || !accessToken}>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Skeleton className="mr-2 h-5 w-5 rounded-full" />
                Loading...
              </div>
            ) : (
              "List Models"
            )}
          </Button>
        </form>
      </CardContent>
      {error && (
        <CardContent>
          <Alert variant="destructive">
            <div className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      )}
      {models.length > 0 && (
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Available Models</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-10 rounded-md" />)
                : models.map((model) => (
                    <Button
                      key={model.model_id}
                      variant={selectedModel?.model_id === model.model_id ? "secondary" : "outline"}
                      onClick={() => handleModelSelect(model)}
                      className="justify-start"
                      disabled={!apiEndpoint || !accessToken}
                    >
                      {model.model_id}
                    </Button>
                  ))}
            </div>
            {selectedModel && (
              <div>
                <h4 className="text-md font-semibold">Selected Model:</h4>
                <p>{selectedModel.model_id}</p>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}