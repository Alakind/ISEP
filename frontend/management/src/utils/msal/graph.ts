import {graphConfig} from "../../AuthConfig.ts";
import {GraphDataInterface} from "../types.tsx";

export async function callMsGraph(accessToken: string): Promise<GraphDataInterface> {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers
  };

  const response: Response = await fetch(graphConfig.graphMeEndpoint, options);

  if (!response.ok) {
    throw new Error(`Failed to retrieve graph data`);
  }
  return response.json();
}