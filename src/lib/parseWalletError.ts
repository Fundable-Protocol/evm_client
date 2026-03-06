/**
 * Parses raw wallet / contract errors into short, human-friendly messages
 * suitable for displaying in a toast notification.
 *
 * Raw errors from MetaMask, WalletConnect, and viem can contain:
 *  - Long JSON payloads with ABI-encoded revert data
 *  - Internal provider message chains ("MetaMask Tx Signature: User denied…")
 *  - EIP-1474 RPC error objects with nested `data.message` fields
 *  - Stack traces appended to the message string
 */
export function parseWalletError(err: unknown): string {
    const raw = extractRawMessage(err);
    return friendlyMessage(raw);
}

// ─── Step 1: extract the most useful raw string from the error ───────────────

function extractRawMessage(err: unknown): string {
    if (typeof err === "string") return err;
    if (!(err instanceof Error)) return "An unexpected error occurred";

    // viem ContractFunctionExecutionError nests the actual reason in `cause`
    const cause = (err as { cause?: unknown }).cause;
    if (cause instanceof Error) {
        return extractRawMessage(cause);
    }

    // Some wallets put a nested JSON string in `err.message`
    // e.g. '{"code":-32603,"message":"execution reverted","data":{"message":"ERC20: transfer amount exceeds balance"}}'
    if (err.message.startsWith("{")) {
        try {
            const parsed = JSON.parse(err.message);
            const nested =
                parsed?.data?.message ??
                parsed?.error?.message ??
                parsed?.message;
            if (typeof nested === "string") return nested;
        } catch {
            // not JSON, fall through
        }
    }

    return err.message;
}

// ─── Step 2: map the raw string to a clean user-facing message ───────────────

const PATTERNS: Array<[RegExp, string]> = [
    // User rejections (many wallet variants)
    [/user (rejected|denied|cancelled|canceled)/i, "Transaction cancelled"],
    [/user rejected the request/i, "Transaction cancelled"],
    [/transaction was rejected/i, "Transaction cancelled"],
    [/request rejected/i, "Transaction cancelled"],
    [/declined by user/i, "Transaction cancelled"],

    // Insufficient funds
    [/insufficient funds/i, "Insufficient funds to complete this transaction"],
    [/transfer amount exceeds balance/i, "Insufficient token balance"],
    [/exceeds balance/i, "Insufficient token balance"],

    // Allowance
    [/insufficient allowance/i, "Token spend not approved — please try again"],
    [/transfer amount exceeds allowance/i, "Token spend not approved — please try again"],

    // Nonce/mempool
    [/nonce too (low|high)/i, "Transaction conflict — please reset your wallet nonce or try again"],
    [/replacement (fee too low|transaction underpriced)/i, "Network fee too low — try increasing gas"],
    [/transaction underpriced/i, "Network fee too low — try increasing gas"],

    // Gas
    [/out of gas/i, "Transaction ran out of gas — please try again"],
    [/gas (required exceeds allowance|limit reached)/i, "Gas limit exceeded — please try again"],
    [/intrinsic gas too low/i, "Gas limit too low — try increasing it in your wallet"],

    // Across / SpokePool specific
    [/invalid fill deadline/i, "Bridge quote expired — please refresh and try again"],
    [/deposit is not fillable/i, "Bridge deposit could not be filled — please try again"],
    [/spoke.*pool/i, "Bridge contract error — please try again"],

    // Generic revert
    [/execution reverted/i, "Transaction reverted by the contract — please try again"],
    [/revert/i, "Transaction reverted — please try again"],

    // Network errors
    [/network.*changed/i, "Network changed — please reconnect and try again"],
    [/chain.*mismatch/i, "Wrong network — please switch to the correct chain"],
    [/could not (fetch|connect)/i, "Network error — please check your connection"],
    [/timeout/i, "Request timed out — please try again"],

    // RPC
    [/internal (json-?rpc )?error/i, "RPC error — please try again or switch providers"],
    [/\-32\d{3}/, "RPC error — please try again"],
];

function friendlyMessage(raw: string): string {
    // Strip stack traces (everything after the first newline that looks like "  at ")
    const firstLine = raw.split(/\n\s+at /)[0].trim();

    for (const [pattern, friendly] of PATTERNS) {
        if (pattern.test(firstLine)) return friendly;
    }

    // If the remaining message is short and readable, use it directly
    if (firstLine.length <= 120 && !firstLine.includes("0x")) {
        // Capitalise first letter and ensure it ends with a period
        const cleaned = firstLine.charAt(0).toUpperCase() + firstLine.slice(1);
        return cleaned.endsWith(".") ? cleaned : cleaned + ".";
    }

    // Fallback
    return "Transaction failed — please try again";
}
