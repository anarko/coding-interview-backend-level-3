interface PingResponse {
  ok: boolean;
}

class RootController {
  public async ping(): Promise<PingResponse> {
    return {
      ok: true,
    };
  }
}

export const rootController = new RootController();
