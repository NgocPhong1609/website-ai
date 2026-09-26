/** Convert transport/provider failures into messages suitable for the product UI. */
type ErrorRecord = Record<string, unknown>;
const DEFAULT_MESSAGE = 'Không thể hoàn tất thao tác. Vui lòng thử lại. Nếu vẫn gặp lỗi, hãy liên hệ bộ phận hỗ trợ.';
const NETWORK_MESSAGE = 'Không thể kết nối tới hệ thống. Vui lòng kiểm tra kết nối mạng rồi thử lại. Nếu vẫn gặp lỗi, hãy liên hệ bộ phận hỗ trợ.';

function record(value: unknown): ErrorRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as ErrorRecord : {};
}
function details(error: unknown) {
  const source = record(error);
  const response = record(source.response);
  const payload = record(response.data ?? source.data ?? error);
  const status = Number(response.status ?? source.status) || undefined;
  return { source, response, payload, status };
}

// Never display stack traces, queries, HTML gateway pages or internal URLs to users.
function readableMessage(value: unknown): string | undefined {
  if (typeof value !== 'string') return;
  const text = value.trim();
  if (!text || text.length > 600 || /<[^>]+>|SQLSTATE|(?:select|insert|update|delete)\s+.*\s+(?:from|into|set)|(?:https?:\/\/)|(?:[A-Z]:\\|\/(?:var|home|app|usr|srv)\/)|(?:App|Illuminate|Symfony)\\|stack\s*trace|Expected response|Unexpected token|Connection refused|Call to undefined|Request failed with status|\b(?:Exception|TypeError|ReferenceError|SyntaxError)\b|\b(?:password|token|secret|api[_-]?key)\s*[=:]|\b(?:ECONN\w*|ENOTFOUND)\b/i.test(text)) return;
  const english: Record<string, string> = {
    'unauthenticated.': 'Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
    'unauthorized': 'Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
    'forbidden': 'Bạn không có quyền thực hiện thao tác này. Vui lòng liên hệ người quản trị nếu cần cấp quyền.',
    'invalid credentials': 'Email hoặc mật khẩu chưa đúng. Vui lòng kiểm tra và thử lại.',
  };
  if (english[text.toLowerCase()]) return english[text.toLowerCase()];
  // Existing Vietnamese business messages are useful; unknown English diagnostics are not.
  if (/[À-ỹĐđ]/.test(text) && !/[ÃÄÂ][\u0080-\u00ff]|á»|áº|├|ß╗/.test(text)) return text;
}

const FIELD_LABELS: Record<string, string> = {
  email: 'Email', password: 'Mật khẩu', password_confirmation: 'Mật khẩu xác nhận',
  new_password: 'Mật khẩu mới', new_password_confirmation: 'Mật khẩu mới xác nhận',
  current_password: 'Mật khẩu hiện tại', name: 'Họ tên', full_name: 'Họ tên', otp: 'Mã xác nhận',
  title: 'Tiêu đề', description: 'Mô tả', price: 'Giá', file: 'Tệp', image: 'Ảnh',
  thumbnail: 'Ảnh bìa', content: 'Nội dung', phone: 'Số điện thoại', phone_number: 'Số điện thoại',
};

export function getValidationErrors(errorOrPayload: unknown): Record<string, string> {
  const { payload, source } = details(errorOrPayload);
  const fields = record(payload.errors ?? source.errors);
  const result: Record<string, string> = {};
  for (const [field, messages] of Object.entries(fields)) {
    const first = Array.isArray(messages) ? messages.find(value => typeof value === 'string') : messages;
    const friendly = readableMessage(first);
    if (friendly) { result[field] = friendly; continue; }
    const label = FIELD_LABELS[field.split('.')[0]] || 'Thông tin';
    const text = typeof first === 'string' ? first : '';
    if (/required/i.test(text)) result[field] = `Vui lòng nhập ${label.toLowerCase()}.`;
    else if (/valid email/i.test(text)) result[field] = 'Địa chỉ email chưa đúng định dạng. Vui lòng kiểm tra lại.';
    else if (/already been taken|already exists/i.test(text)) result[field] = `${label} đã được sử dụng. Vui lòng kiểm tra lại.`;
    else if (/confirmation.*match|confirmed/i.test(text)) result[field] = `${label} xác nhận không khớp. Vui lòng nhập lại.`;
    else if (/at least (\d+) characters/i.test(text)) result[field] = `${label} cần có ít nhất ${text.match(/at least (\d+) characters/i)![1]} ký tự.`;
    else if (/greater than (\d+) characters/i.test(text)) result[field] = `${label} không được vượt quá ${text.match(/greater than (\d+) characters/i)![1]} ký tự.`;
    else result[field] = `${label} chưa hợp lệ. Vui lòng kiểm tra lại.`;
  }
  return result;
}

export function isUnauthorizedError(error: unknown): boolean {
  const { status, source } = details(error);
  return status === 401 || source.name === 'AuthenticationError' || (typeof source.message === 'string' && /Unauthorized|\b401\b/.test(source.message));
}

export function getErrorMessage(error: unknown, fallback = DEFAULT_MESSAGE): string {
  const { source, response, payload, status } = details(error);
  const message = typeof source.message === 'string' ? source.message : typeof error === 'string' ? error : '';
  if (status === 504 || status === 408 || source.code === 'ETIMEDOUT' || source.code === 'ECONNABORTED' || source.name === 'TimeoutError' || /timeout|timed out/i.test(message)) {
    return 'Hệ thống phản hồi quá lâu. Vui lòng thử lại sau ít phút. Nếu đang thanh toán, hãy kiểm tra trạng thái đơn hàng trước khi thử lại.';
  }
  if (status && status >= 500) {
    const explanation = status === 500 ? readableMessage(payload.message) : undefined;
    if (explanation) return /Vui lòng|hãy/i.test(explanation) ? explanation : `${explanation}${/[.!?]$/.test(explanation) ? "" : "."} Vui lòng thử lại sau ít phút.`;
    return 'Hệ thống tạm thời không phản hồi hoặc gặp sự cố. Vui lòng thử lại sau ít phút. Nếu vẫn gặp lỗi, hãy liên hệ bộ phận hỗ trợ.';
  }
  if (source.code === 'INVALID_RESPONSE') return 'Hệ thống trả về phản hồi không hợp lệ. Vui lòng thử lại sau. Nếu vẫn gặp lỗi, hãy liên hệ bộ phận hỗ trợ.';
  if (source.code === 'ERR_NETWORK' || /Failed to fetch|fetch failed|Network Error|NetworkError|Load failed/i.test(message)) return NETWORK_MESSAGE;
  if (status === 413) return 'Tệp bạn chọn vượt quá dung lượng cho phép. Vui lòng chọn tệp nhỏ hơn rồi thử lại.';
  if (status === 429) {
    const seconds = Number(source.retryAfter ?? record(response.headers)['retry-after']);
    if (Number.isFinite(seconds) && seconds > 0) return `Bạn đã gửi quá nhiều yêu cầu. Vui lòng chờ ${Math.ceil(seconds)} giây rồi thử lại.`;
    return readableMessage(payload.message) || 'Bạn đã gửi quá nhiều yêu cầu trong thời gian ngắn. Vui lòng chờ một lúc rồi thử lại.';
  }
  const validation = getValidationErrors(error);
  if ((!status || status === 422 || status === 400) && Object.keys(validation).length) return Object.values(validation).slice(0, 3).join(' ');
  const friendly = readableMessage(payload.message) || readableMessage(message);
  if (friendly) return friendly;
  if (isUnauthorizedError(error)) return 'Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.';
  if (status === 403) return 'Bạn không có quyền thực hiện thao tác này. Vui lòng liên hệ người quản trị nếu cần cấp quyền.';
  if (status === 404) return 'Không tìm thấy nội dung hoặc chức năng bạn yêu cầu. Vui lòng tải lại trang; nếu vẫn gặp lỗi, hãy liên hệ bộ phận hỗ trợ.';
  if (status === 409) return 'Dữ liệu đã thay đổi hoặc thao tác bị xung đột. Vui lòng tải lại dữ liệu và kiểm tra trước khi thực hiện lại.';
  if (status === 419) return 'Phiên làm việc đã hết hạn. Vui lòng tải lại trang và đăng nhập lại.';
  if (status === 422 || status === 400) return 'Thông tin gửi lên chưa hợp lệ. Vui lòng kiểm tra các trường đã nhập và thử lại.';
  if (/Application failed to respond|Bad Gateway|Service Unavailable/i.test(message)) return 'Hệ thống tạm thời không phản hồi. Vui lòng thử lại sau ít phút.';
  return readableMessage(fallback) || DEFAULT_MESSAGE;
}

export class ApiError extends Error {
  readonly status?: number;
  readonly errors?: Record<string, unknown>;
  readonly code?: string;
  readonly retryAfter?: string | null;
  constructor(status: number | undefined, data: unknown, fallback?: string, code?: string, retryAfter?: string | null) {
    super(getErrorMessage({ status, data, code, retryAfter }, fallback));
    this.name = status === 401 ? 'AuthenticationError' : 'ApiError';
    this.status = status;
    this.errors = record(record(data).errors);
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

/** Preserve HTTP status even when a proxy returns HTML, plain text or an empty body. */
export async function readApiResponse<T = any>(response: Response, fallback?: string): Promise<T> {
  let payload: unknown;
  try { payload = await response.json(); }
  catch {
    if (response.ok && response.status !== 204) throw new ApiError(response.status, {}, fallback, 'INVALID_RESPONSE');
  }
  if (!response.ok) throw new ApiError(response.status, payload, fallback, undefined, response.headers?.get('retry-after'));
  if (response.status !== 204 && (payload === null || typeof payload !== 'object')) throw new ApiError(response.status, {}, fallback, 'INVALID_RESPONSE');
  return (payload ?? {}) as T;
}
