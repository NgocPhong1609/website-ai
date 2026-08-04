<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Answer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuizAssessmentSeeder extends Seeder
{
    public function run(): void
    {
        DB::beginTransaction();

        try {
            // Get or create reference Courses for real associations
            $courseWeb = Course::where('slug', 'like', '%nextjs%')->first() ?? Course::first();
            $courseAI = Course::where('slug', 'like', '%ai%')->first() ?? Course::first();

            $modWeb = CourseModule::where('course_id', $courseWeb ? $courseWeb->id : 1)->first() ?? CourseModule::first();
            $modAI = CourseModule::where('course_id', $courseAI ? $courseAI->id : 1)->first() ?? CourseModule::first();

            // Clear existing test quizzes to avoid duplication
            Quiz::query()->delete();
            Lesson::where('type', 'quiz_module')->delete();

            $assessments = [
                [
                    'lesson_title' => 'Kiểm tra Nền tảng: Mạng Thần Kinh & Deep Learning',
                    'course_id' => $courseAI ? $courseAI->id : null,
                    'module_id' => $modAI ? $modAI->id : null,
                    'time_limit' => 15,
                    'passing_score' => 70,
                    'description' => 'Kiểm nghiệm vững chắc tư duy kiến trúc Mạng Thần Kinh (ANN/CNN), cơ chế Attention trong Transformer và xử lý Overfitting.',
                    'questions' => [
                        [
                            'content' => 'Trong mô hình Mạng thần kinh học sâu (Deep Neural Networks), vai trò chính của hàm kích hoạt (Activation Function) như ReLU hay Sigmoid là gì?',
                            'ai_insight' => 'Hàm kích hoạt phá vỡ tính tuyến tính đơn thuần của phép nhân ma trận, cho phép mạng học các ranh giới quyết định vô song.',
                            'answers' => [
                                ['content' => 'Giới thiệu thuộc tính phi tuyến tính (non-linearity) vào mạng thần kinh để giải quyết các vấn đề phức tạp', 'is_correct' => true],
                                ['content' => 'Giảm tỷ lệ tiêu hao năng lượng điện của vi xử lý GPU trong quá trình luyện tập mô hình', 'is_correct' => false],
                                ['content' => 'Tự động nhân đôi kích thước tập dữ liệu huấn luyện (Dataset augmentation)', 'is_correct' => false],
                                ['content' => 'Hủy bỏ hoàn toàn trọng số bias (w0) ra khỏi phương trình tuyến tính', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Trong kiến trúc Transformer, cơ chế Self-Attention mang lại đột phá kỹ thuật cốt lõi nào so với RNN/LSTM truyền thống?',
                            'ai_insight' => 'Attention cho phép so khớp tất cả các từ trong câu đồng thời, khắc phục hoàn toàn điểm yếu nút thắt cổ chai của RNN.',
                            'answers' => [
                                ['content' => 'Khả năng tính toán song song toàn bộ chuỗi token (Parallel processing) và nắm bắt liên kết ngữ cảnh ở khoảng cách dài', 'is_correct' => true],
                                ['content' => 'Bắt buộc phải quét văn bản tuần tự từng từ một từ trái qua phải', 'is_correct' => false],
                                ['content' => 'Chỉ hỗ trợ dịch thuật đơn ngữ cho ngôn ngữ lập trình Python', 'is_correct' => false],
                                ['content' => 'Tự động khóa dung lượng bộ nhớ RAM trên hệ thống phần cứng ở mức cố định 4GB', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Khái niệm Overfitting (Quá khớp) trong học máy (Machine Learning) mô tả tình trạng nào của mô hình AI?',
                            'ai_insight' => 'Mô hình quá khớp ghi nhớ lòng dòng noise của tập huấn luyện nhưng mất khả năng suy diễn trên dữ liệu mới.',
                            'answers' => [
                                ['content' => 'Mô hình đạt độ chính xác gần 100% trên tập dữ liệu huấn luyện nhưng hoạt động kém trên dữ liệu mới trong thực tiễn', 'is_correct' => true],
                                ['content' => 'Mô hình từ chối đọc các tệp văn bản có định dạng JSON hoặc CSV', 'is_correct' => false],
                                ['content' => 'Tốc độ khởi động máy chủ API chậm hơn tiêu chuẩn quy định của hệ thống mạng', 'is_correct' => false],
                                ['content' => 'Số lượng biến trọng số (parameters) bằng đúng 0 trong phương trình', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Thuật ngữ "Prompt Engineering" trong hệ sinh thái Mô hình Ngôn ngữ Lớn (LLMs) ám chỉ hoạt động chuyên môn nào?',
                            'ai_insight' => 'Kỹ sư Prompt định hình không gian ngữ cảnh thông qua cấu trúc ngữ pháp và ràng buộc rõ ràng.',
                            'answers' => [
                                ['content' => 'Nghệ thuật thiết kế, tối ưu hóa cấu trúc lời dẫn và chỉ thị để dẫn dắt trí tuệ nhân tạo tạo ra đầu ra chính xác, tối ưu', 'is_correct' => true],
                                ['content' => 'Sửa đổi trực tiếp bảng mạch silicon bên trong cụm siêu máy tính cá nhân', 'is_correct' => false],
                                ['content' => 'Tắt tường lửa bảo mật của trình duyệt web Chrome trong khi chạy local environment', 'is_correct' => false],
                                ['content' => 'Viết mã máy hợp ngữ (Assembly code) bằng tay để chỉnh sửa nhân CPU', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Để ngăn ngừa tình trạng Overfitting, kỹ thuật Regularization (Chuẩn hóa) nào dưới đây thường xuyên được sử dụng bằng cách tắt ngẫu nhiên một số neuron trong quá trình huấn luyện?',
                            'ai_insight' => 'Dropout ngắt liên kết ngẫu nhiên, buộc các nơ-ron còn lại phải tự lực độc lập chiết xuất đặc trưng.',
                            'answers' => [
                                ['content' => 'Dropout Layer', 'is_correct' => true],
                                ['content' => 'Softmax Activation', 'is_correct' => false],
                                ['content' => 'Gradient Descent', 'is_correct' => false],
                                ['content' => 'Max Pooling', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Trong xử lý ảnh bằng Mạng thần kinh tích chập (CNN), lớp Pooling (như Max Pooling) đóng vai trò chính gì?',
                            'ai_insight' => 'Pooling giữ lại đỉnh sáng tín hiệu quan trọng nhất, đồng thời thu thập tính bất biến tịnh tiến.',
                            'answers' => [
                                ['content' => 'Giảm kích thước không gian của bản đồ đặc trưng (feature maps) nhằm giảm số lượng tính toán và trọng số', 'is_correct' => true],
                                ['content' => 'Tăng độ phân giải ảnh từ 1080p lên 4K sắc nét', 'is_correct' => false],
                                ['content' => 'Chuyển đổi ảnh tĩnh thành tệp video định dạng MP4', 'is_correct' => false],
                                ['content' => 'Xóa bỏ hoàn toàn màu xanh lá cây ra khỏi kênh màu RGB', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Thuật toán Lan truyền ngược (Backpropagation) trong quá trình huấn luyện mạng neural hoạt động dựa trên nguyên lý toán học nào?',
                            'ai_insight' => 'Quy tắc đạo hàm chuỗi cho phép tính đạo hàm từng tầng từ lớp đầu ra lùi về tận lớp đầu vào.',
                            'answers' => [
                                ['content' => 'Quy tắc đạo hàm chuỗi (Chain rule) của giải tích để tính đạo hàm riêng của hàm mất mát theo từng trọng số', 'is_correct' => true],
                                ['content' => 'Cộng dồn số lượng pixel trên màn hình theo bảng cửu chương', 'is_correct' => false],
                                ['content' => 'Phân tán chia ngẫu nhiên số liệu bằng xúc xắc cá cược', 'is_correct' => false],
                                ['content' => 'Tự động thay đổi ngôn ngữ SQL thành chuỗi chuỗi Hexadecimal', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Hàm kích hoạt Softmax thường được bố trí ở lớp nào của Mạng thần kinh phân loại đa lớp (Multi-class Classification)?',
                            'ai_insight' => 'Softmax chuẩn hóa các giá trị thực bất kỳ thành véc-tơ xác suất phân phối có tổng bằng 1.',
                            'answers' => [
                                ['content' => 'Lớp đầu ra cùng (Output Layer) nhằm biến chuỗi điểm số logit thành phân phối xác suất tổng bằng 1', 'is_correct' => true],
                                ['content' => 'Lớp đầu vào đầu tiên (Input Layer) để thay thế bàn phím cơ', 'is_correct' => false],
                                ['content' => 'Lớp giữa bất kỳ (Hidden Layer 2) nhằm mã hóa âm thanh mp3', 'is_correct' => false],
                                ['content' => 'Bên ngoài mô hình, nằm ngay trong tệp cấu hình .env', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Khi huấn luyện mô hình với tỷ lệ học (Learning Rate - α) quá lớn, hiện tượng tiêu cực nào có thể xảy ra trong quá trình tối ưu hàm mục tiêu (Gradient Descent)?',
                            'ai_insight' => 'Bước nhảy quá dài vượt quá thung lũng cực tiểu toàn cục, khiến đồ thị hàm mất mát chao đảo phân rã.',
                            'answers' => [
                                ['content' => 'Bước nhảy quá dài khiến quá trình tính toán bị chao đảo (oscillate) hoặc lệch hẳn ra xa khỏi cực tiểu toàn cục', 'is_correct' => true],
                                ['content' => 'Máy chủ lập tức bị cúp nguồn do quá nhiệt ổ đĩa HDD', 'is_correct' => false],
                                ['content' => 'Mô hình sẽ hoàn tất huấn luyện trong 1 mili-giây với độ chính xác 100%', 'is_correct' => false],
                                ['content' => 'Tự động mở trình duyệt web và xóa tệp database.sqlite', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Khái niệm "Zero-shot Learning" trong Mô hình Ngôn ngữ Lớn (LLM) biểu trưng cho năng lực ấn tượng nào?',
                            'ai_insight' => 'Mô hình khổng lồ tổng hợp lượng kiến thức tri thức sufficient để hiểu lệnh mới chưa từng huấn luyện cụ thể.',
                            'answers' => [
                                ['content' => 'Khả năng thực hiện xuất sắc một tác vụ mới lạ mà không cần được cung cấp bất kỳ mẫu ví dụ dẫn lối (few-shot examples) nào trong lời gọi Prompt', 'is_correct' => true],
                                ['content' => 'Tốc độ trả lời của mô hình bằng đúng 0 mili-giây không cần Internet', 'is_correct' => false],
                                ['content' => 'Chỉ tốn chi phí đúng 0 đồng cho toàn bộ hạ tầng cloud OpenAI', 'is_correct' => false],
                                ['content' => 'Không sử dụng bộ vi xử lý máy tính nào mà tự vận hành bằng ánh sáng', 'is_correct' => false],
                            ]
                        ]
                    ]
                ],
                [
                    'lesson_title' => 'Kiểm tra Chuyên môn: Next.js 15 & React 19 Server Actions',
                    'course_id' => $courseWeb ? $courseWeb->id : null,
                    'module_id' => $modWeb ? $modWeb->id : null,
                    'time_limit' => 15,
                    'passing_score' => 70,
                    'description' => 'Đọ sức sâu với cơ chế React 19 Actions, useActionState, Suspense Boundaries và tối ưu hóa Render trên Server vs Client.',
                    'questions' => [
                        [
                            'content' => 'Trong React 19, custom hook mới nào được chính thức mang đến để quản lý trạng thái của biểu mẫu (form state) khi phối hợp cùng Server Actions?',
                            'ai_insight' => 'useActionState thay thế hoàn toàn cho useFormState từ React 18 Experimental.',
                            'answers' => [
                                ['content' => 'useActionState (trước đây từng là useFormState trong giai đoạn thử nghiệm)', 'is_correct' => true],
                                ['content' => 'useFormValidationMaster()', 'is_correct' => false],
                                ['content' => 'useServerInputSync()', 'is_correct' => false],
                                ['content' => 'useStateQueryServer()', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Khai báo directive "use server"; khi đặt ở đầu một hàm bất kỳ bên trong Next.js 15 chỉ ra điều kiện gì?',
                            'ai_insight' => 'Directive này đánh dấu hàm là Server Action, được bảo vệ và thực thi riêng biệt tại backend.',
                            'answers' => [
                                ['content' => 'Biến hàm đó thành một Server Action, cho phép trình duyệt client hoặc form có thể kích hoạt trực tiếp hàm chạy an toàn trên Backend Server', 'is_correct' => true],
                                ['content' => 'Bắt buộc người dùng phải tải về máy ảo Docker khi vào website', 'is_correct' => false],
                                ['content' => 'Chuyển toàn bộ CSS thành tệp nhị phân nén của máy chủ Apache', 'is_correct' => false],
                                ['content' => 'Chỉ cho phép tài khoản Admin đăng nhập xem trang đó', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Trong Next.js 15, mặc định của các phương thức tải dữ liệu fetch() bằng Server Components đã thay đổi cơ chế bộ nhớ đệm (cache) như thế nào so với Next.js 14?',
                            'ai_insight' => 'Next.js 15 đã loại bỏ chế độ cache mặc định cồng kềnh của Next 14, chuyển sang un-cached.',
                            'answers' => [
                                ['content' => 'Mặc định fetch() chuyển sang chế độ không lưu đệm (no-store / un-cached) để luôn phản ánh dữ liệu tươi nhất từ nguồn', 'is_correct' => true],
                                ['content' => 'Mặc định khóa chết bộ nhớ đệm vĩnh viễn trong 365 ngày', 'is_correct' => false],
                                ['content' => 'Bắt buộc phải ghi file đệm ra tệp Desktop văn bản word', 'is_correct' => false],
                                ['content' => 'Không cho phép dùng lệnh fetch() nữa mà bắt buộc gọi qua JQuery AJAX', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Thẻ <Suspense fallback={<Skeleton />}> trong React 19 và Next.js 15 đóng vai trò kiến trúc trọng yếu nào?',
                            'ai_insight' => 'Suspense phân tách UI thành các dòng streaming không cản trở nhau.',
                            'answers' => [
                                ['content' => 'Cho phép hiển thị giao diện thay thế mượt mà (loading skeleton) trong lúc các khối Server Component con bên trong đang chờ xử lý bất đồng bộ', 'is_correct' => true],
                                ['content' => 'Tự động đóng băng tài khoản học viên nếu nhấp trúng thẻ fallback', 'is_correct' => false],
                                ['content' => 'Đổi toàn bộ ảnh trên web sang dải màu đen trắng phong cách cổ điển', 'is_correct' => false],
                                ['content' => 'Phát ra tiếng nhạc thông báo mỗi khi có ai nhấn vào link trang chủ', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Khi một Server Action thực hiện sửa đổi dữ liệu trong CSDL, phương pháp chuẩn nào để lập tức xóa đệm (invalidate cache) cho một lộ trình URL cụ thể?',
                            'ai_insight' => 'revalidatePath làm mới lập tức bộ đệm CDN và Router của đường dẫn cụ thể.',
                            'answers' => [
                                ['content' => 'Gọi hàm revalidatePath("/student/dashboard") bên trong Server Action', 'is_correct' => true],
                                ['content' => 'Dùng lệnh window.location.reload(true) của javascript cổ điển', 'is_correct' => false],
                                ['content' => 'Xóa biến environment khỏi file .env trong thư mục root', 'is_correct' => false],
                                ['content' => 'Gửi email cho ban quản trị xin phím bấm reset cache thủ công', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Trong React 19, custom hook useOptimistic() đem tới trải nghiệm UX ấn tượng như thế nào cho hệ thống biểu mẫu?',
                            'ai_insight' => 'useOptimistic giúp giao diện mượt mà không độ trễ bằng cách phỏng đoán thành công trước khi Server phản hồi.',
                            'answers' => [
                                ['content' => 'Cập nhật hiển thị giao diện Client tức thì với giá trị giả định mang tính tích cực (optimistic) trong khi Server Action chưa trả về kết quả', 'is_correct' => true],
                                ['content' => 'Tự động hiển thị lời động viên tinh thần khi người dùng gõ sai mật khẩu', 'is_correct' => false],
                                ['content' => 'Đẩy xung nhịp GPU lên mức cao nhất để làm sáng màn hình Laptop', 'is_correct' => false],
                                ['content' => 'Tự động dịch ngôn ngữ toàn bộ giao diện từ Anh sang Nga', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Khi phát triển Next.js 15, ranh giới rõ nét nhất giữa React Server Component (RSC) và Client Component ("use client") nằm ở thuộc tính nào?',
                            'ai_insight' => 'RSC tuyệt đối không can thiệp Browser APIs hay State Hooks của client.',
                            'answers' => [
                                ['content' => 'RSC chạy thuần trên Server không đóng gói JS tới trình duyệt; Client Component có quyền truy cập State (useState), Effect (useEffect) và Event Listeners', 'is_correct' => true],
                                ['content' => 'RSC bắt buộc phải dùng HTML cổ điển không có thẻ div', 'is_correct' => false],
                                ['content' => 'Client Component không thể chạy được trên thiết bị di động', 'is_correct' => false],
                                ['content' => 'Hai định nghĩa này hoàn toàn giống hệt nhau về mọi tham số kỹ thuật', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Trong cấu trúc thư mục App Router của Next.js, mục đích sử dụng tệp loading.tsx nằm ngang hàng với page.tsx là gì?',
                            'ai_insight' => 'Next.js tự động compile loading.tsx thành Suspense boundary bao quanh page.tsx.',
                            'answers' => [
                                ['content' => 'Tự động bọc tệp page.tsx vào trong một tầng React Suspense Boundary và hiển thị nội dung của loading.tsx khi chuyển lộ trình (routing)', 'is_correct' => true],
                                ['content' => 'Chỉ là một file nháp tạm thời của developer trước khi tải lên kho lưu trữ Github', 'is_correct' => false],
                                ['content' => 'Dùng để đếm số giây trình duyệt đã mở từ lúc khởi động', 'is_correct' => false],
                                ['content' => 'Tự động sao lưu dữ liệu máy chủ về đĩa đè ổ mây Google Drive', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Trong Next.js 15, khi nào developer NÊN sử dụng một Route Handler (route.ts) thay vì một Server Action?',
                            'ai_insight' => 'Route Handler dành cho REST, Webhooks và Streaming độc lập.',
                            'answers' => [
                                ['content' => 'Khi cần tạo một điểm truy cập API chung cho ứng dụng ngoại vi (Mobile App, Webhooks của đối tác) hoặc xây dựng luồng AI Streaming độc lập', 'is_correct' => true],
                                ['content' => 'Khi muốn tạo một nút bấm đơn giản trên biểu mẫu đăng nhập trang chủ', 'is_correct' => false],
                                ['content' => 'Khi không thích viết cú pháp JavaScript mang phong cách mới', 'is_correct' => false],
                                ['content' => 'Khi muốn khóa hiển thị ảnh avatar của người dùng ẩn danh', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Tính năng Partial Prerendering (PPR) được ra mắt trong Next.js đem tới giải pháp hợp nhất ưu thế nào?',
                            'ai_insight' => 'PPR kết hợp SSG cho phần khung chung tĩnh và SSR streaming cho các khối động riêng cá nhân.',
                            'answers' => [
                                ['content' => 'Kết hợp lớp sườn nội dung tĩnh (Static shell) tốc độ cao cùng các khối động (Dynamic streaming) tải trực tiếp trong cùng một chuỗi phản hồi HTTP duy nhất', 'is_correct' => true],
                                ['content' => 'Chỉ xuất xám một phần 50% góc trái của website cho khách vãng lai', 'is_correct' => false],
                                ['content' => 'Tự động cắt chẵn dung lượng đĩa cứng máy chủ để tiết kiệm điện', 'is_correct' => false],
                                ['content' => 'Vô hiệu hóa 1/2 bộ nhớ đệm Redis trong múi giờ ban đêm', 'is_correct' => false],
                            ]
                        ]
                    ]
                ],
                [
                    'lesson_title' => 'Kiểm tra Thực chiến: Tích hợp API & AI Stream 🚀',
                    'course_id' => $courseWeb ? $courseWeb->id : null,
                    'module_id' => $modWeb ? $modWeb->id : null,
                    'time_limit' => 15,
                    'passing_score' => 70,
                    'description' => 'Thử sức và kiểm nghiệm mức độ thông tuệ về Xử lý Route Handlers, Streaming LLM và Logic Bất đồng bộ trong Next.js 15.',
                    'questions' => [
                        [
                            'content' => 'Trong Next.js 15 App Router, quy ước đặt tên tệp nào sau đây được bắt buộc sử dụng để định nghĩa một Route Handler chịu trách nhiệm xử lý các HTTP request (GET, POST)?',
                            'ai_insight' => 'Tệp route.ts là tiêu chuẩn bắt buộc cho các API Endpoint trong thư mục app.',
                            'answers' => [
                                ['content' => 'route.ts hoặc route.js đặt bên trong một thư mục thuộc app/', 'is_correct' => true],
                                ['content' => 'api.ts đặt ở vị trí root gốc của dự án', 'is_correct' => false],
                                ['content' => 'page.ts tích hợp chung hàm export REST handler', 'is_correct' => false],
                                ['content' => 'controller.tsx cấu hình trong middleware', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Khi triển khai một Route Handler trong Next.js 15, sự khác biệt căn bản về cơ chế bộ nhớ đệm (caching) giữa hàm export async function GET() và POST() là gì?',
                            'ai_insight' => 'Phương thức POST làm thay đổi dữ liệu (mutation), do đó hệ thống không bao giờ cache.',
                            'answers' => [
                                ['content' => 'GET có thể được cache tùy thuộc vào dynamic config, trong khi POST luôn luôn thực thi theo thời gian thực (opt-out of cache)', 'is_correct' => true],
                                ['content' => 'POST luôn được hệ thống tự động lưu trữ tĩnh trong 1 tiếng', 'is_correct' => false],
                                ['content' => 'Cả GET và POST đều bị buộc khóa bộ nhớ đệm trên CDN Cloudflare', 'is_correct' => false],
                                ['content' => 'GET bắt buộc phải trả về tệp nhị phân thay vì JSON Data', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Từ Next.js 15 trở đi, tham số động (dynamic routing parameters) trong các Route Handlers như { params } có sự thay đổi mang tính cốt lõi nào khi truy xuất?',
                            'ai_insight' => 'params trong Next.js 15 là Promise, bắt buộc await trước khi lấy tham số bên trong.',
                            'answers' => [
                                ['content' => 'params là một Promise bất đồng bộ và bắt buộc phải dùng await trước khi trích xuất giá trị id', 'is_correct' => true],
                                ['content' => 'params được chuyển thành đối tượng window.localStorage của trình duyệt', 'is_correct' => false],
                                ['content' => 'Tham số động bị loại bỏ và thay hoàn toàn bằng URLSearchParams', 'is_correct' => false],
                                ['content' => 'Chỉ hỗ trợ truyền tối đa 1 ký tự duy nhất trong chuỗi path', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => '💡 [Câu hỏi 4 - AI Golden Tip] Trong chiến lược Fallback giữa Google Gemini và OpenAI, khi dòng truyền streaming từ một nhà cung cấp gặp trở ngại kỹ thuật, cách quản lý đối tượng ReadableStream nào dưới đây đảm bảo không phá vỡ kết nối hiện tại của Client?',
                            'ai_insight' => 'TransformStream đóng vai trò lớp đệm duy trì kết nối HTTP không ngắt quãng cho Client.',
                            'answers' => [
                                ['content' => 'Sử dụng TransformStream để bọc luồng dữ liệu; khi phát hiện lỗi nghẽn mạch, ngay lập tức đóng Reader hiện tại và chuyển (pipe) sang luồng ReadableStream của AI Provider dự phòng', 'is_correct' => true],
                                ['content' => 'Xóa hoàn toàn thẻ HTML <script> và bắt chuỗi kết nối tải lại trang từ đầu', 'is_correct' => false],
                                ['content' => 'Gửi mã lỗi HTTP 500 để trình duyệt hiển thị màn hình trắng thông báo sập nguồn', 'is_correct' => false],
                                ['content' => 'Yêu cầu người dùng bấm nút đăng xuất khỏi phiên làm việc Sanctum', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Để khởi tạo một luồng phát tín hiệu thời gian thực (Real-time AI Stream) trong Next.js Route Handlers, đối tượng trả về chuẩn hóa cần tuân thủ cấu trúc nào?',
                            'ai_insight' => 'Giao thức SSE yêu cầu Content-Type là text/event-stream và body là ReadableStream.',
                            'answers' => [
                                ['content' => 'new Response(readableStream, { headers: { "Content-Type": "text/event-stream" } })', 'is_correct' => true],
                                ['content' => 'NextResponse.json({ stream: true, speed: 100 })', 'is_correct' => false],
                                ['content' => 'return echo($token_stream_chunk);', 'is_correct' => false],
                                ['content' => 'window.open("https://stream.ai.mindnova");', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Trong cấu hình tệp Route Handlers cho các dịch vụ AI Stream tốc độ cực cao, khai báo export const runtime = "edge" mang đến sức mạnh thực thi nào?',
                            'ai_insight' => 'Edge runtime chạy trên nền V8 nhẹ nhàng, không bị gánh nặng khởi động của Node server.',
                            'answers' => [
                                ['content' => 'Thực thi trên mạng lưới Edge của Cloudflare/Vercel với độ trễ khởi động (cold start) gần như bằng 0 và sử dụng bộ API chuẩn Web V8', 'is_correct' => true],
                                ['content' => 'Ép máy chủ vật lý tải toàn bộ thư viện Node.js khổng lồ vào RAM 64GB', 'is_correct' => false],
                                ['content' => 'Chỉ cho phép trình duyệt Microsoft Edge truy cập vào trang web', 'is_correct' => false],
                                ['content' => 'Tự động vô hiệu hóa toàn bộ cơ chế mã hóa mật khẩu HTTPS', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => '💡 [Câu hỏi 7 - AI Golden Tip] Để kiểm soát hiệu quả vấn đề treo kết nối khi LLM Provider không phản hồi (Header Timeout Fallback), kỹ thuật lập trình bất đồng bộ nào nên được gắn vào cấu hình Fetch API?',
                            'ai_insight' => 'AbortController phát tín hiệu signal cắt tức thì request bị treo quá thời hạn quy định.',
                            'answers' => [
                                ['content' => 'Tạo đối tượng AbortController kết hợp setTimeout để tự động kích hoạt abort signal sau số giây quy định, mở đường gọi fallback lập tức', 'is_correct' => true],
                                ['content' => 'Thiết lập vòng lặp while(true) chờ đến khi máy chủ phản hồi văn bản', 'is_correct' => false],
                                ['content' => 'Tắt bộ định tuyến mạng và tăng gấp đôi dung lượng bộ nhớ tạm Cookie', 'is_correct' => false],
                                ['content' => 'Sử dụng lệnh alert() yêu cầu học viên kiên nhẫn ngồi đợi thêm 30 phút', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Khi sử dụng thư viện chuyên dụng Vercel AI SDK (hoặc @ai-sdk/react) kết hợp cùng Next.js 15, hàm phương thức nào có nhiệm vụ đóng gói đầu ra của LLM thành một chuỗi dữ liệu Stream hợp lệ để trả về cho Custom Hook useChat()?',
                            'ai_insight' => 'Các phương thức của AI SDK chuyển hóa generator thành DataStreamProtocol chuẩn cho useChat().',
                            'answers' => [
                                ['content' => 'result.toDataStreamResponse() hoặc streamText(...)', 'is_correct' => true],
                                ['content' => 'JSON.stringify(llm_whole_text_array)', 'is_correct' => false],
                                ['content' => 'res.send_stream_packets(true)', 'is_correct' => false],
                                ['content' => 'export function render_ai_html()', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Để bảo vệ các điểm truy cập AI Route Handlers trong Next.js khỏi tình trạng spam requests và khai thác token tài khoản trái phép, lớp chắn bảo mật nào nên được đặt ở tiền tuyến?',
                            'ai_insight' => 'Middleware cản lọc từ xa trước khi request tiêu tốn token AI đắt đỏ tại Backend.',
                            'answers' => [
                                ['content' => 'Next.js Middleware kết hợp kiểm soát Rate Limiting và Bearer Token Authentication', 'is_correct' => true],
                                ['content' => 'Ẩn đường dẫn thư mục bằng cách đổi tên file thành .secret_api', 'is_correct' => false],
                                ['content' => 'Chỉ đặt màu nền CSS trong suốt cho nút bấm Gửi trên giao diện', 'is_correct' => false],
                                ['content' => 'Cho phép tất cả mọi domain gọi CORS tự do không giới hạn', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Khi người dùng vô tình bấm thả hoặc đóng thẻ tab trình duyệt trong khi dòng AI Streaming vẫn đang cuồn cuộn chảy trả về, phương pháp tối ưu resource nào trong Route Handlers của Next.js giúp ngắt tiến trình LLM backend tức thời?',
                            'ai_insight' => 'request.signal thông báo việc client rớt kết nối để lập tức hủy tác vụ LLM tiêu tốn tiền bạc.',
                            'answers' => [
                                ['content' => 'Lắng nghe sự kiện request.signal (AbortSignal) từ HTTP request gốc, nếu client ngắt kết nối thì tự động hủy tiến trình phát streaming', 'is_correct' => true],
                                ['content' => 'Để mặc hệ thống AI chạy cho đến khi vắt kiệt hạn ngạch hóa đơn cloud', 'is_correct' => false],
                                ['content' => 'Gửi email yêu cầu người dùng mở lại tab trình duyệt cũ ngay lập tức', 'is_correct' => false],
                                ['content' => 'Khởi động lại máy chủ proxy Apache bằng dòng lệnh SSH', 'is_correct' => false],
                            ]
                        ]
                    ]
                ],
                [
                    'lesson_title' => 'Kiểm tra Chuyên sâu: Bảo mật, Middleware & Rate Limiting',
                    'course_id' => $courseWeb ? $courseWeb->id : null,
                    'module_id' => $modWeb ? $modWeb->id : null,
                    'time_limit' => 15,
                    'passing_score' => 70,
                    'description' => 'Phân tích khả năng thiết lập tường lửa Middleware, quản lý token bảo mật Sanctum/JWT và kiểm soát giới hạn tài nguyên Rate Limiting cho hệ thống nghìn request.',
                    'questions' => [
                        [
                            'content' => 'Trong kiến trúc Next.js 15, tệp middleware.ts (hoặc middleware.js) được đặt ở vị trí tiêu chuẩn nào trong cấu trúc dự án?',
                            'ai_insight' => 'Middleware nằm ở gốc hoặc trong src/ để chi phối toàn bộ luồng routing của hệ thống.',
                            'answers' => [
                                ['content' => 'Ngay tại vị trí root của dự án hoặc ngay bên trong thư mục src/ (ngang hàng với thư mục app)', 'is_correct' => true],
                                ['content' => 'Bên trong một sub-folder bất kỳ trong node_modules/', 'is_correct' => false],
                                ['content' => 'Đặt trong thư mục public/images/', 'is_correct' => false],
                                ['content' => 'Ẩn dưới đáy thư mục .next/cache/', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Khái niệm "Edge Middleware" trong Next.js biểu thị ưu điểm nổi trội nào khi kiểm soát bảo mật HTTP requests?',
                            'ai_insight' => 'Edge Middleware kiểm tra header và auth token với tốc độ mili-giây trên toàn cầu.',
                            'answers' => [
                                ['content' => 'Thực thi cực nhanh ngay trước khi request chạm tới Node.js runtime chính, giúp loại bỏ truy cập gian lận ngay tại viền CDN', 'is_correct' => true],
                                ['content' => 'Tự động chia sẻ toàn bộ cookie bảo mật cho mọi máy tính kết nối Wifi chung', 'is_correct' => false],
                                ['content' => 'Chuyên dùng để quay phim màn hình của học viên', 'is_correct' => false],
                                ['content' => 'Tắt bộ lọc CORS để các tên miền xấu dễ dàng gọi trộm API', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Khi tích hợp xác thực Laravel Sanctum API với Frontend Next.js 15, phương thức gửi token bảo mật chuẩn hóa trong HTTP Header là gì?',
                            'ai_insight' => 'Tiêu đề Authorization: Bearer token là tiêu chuẩn xác thực không trạng thái (stateless auth).',
                            'answers' => [
                                ['content' => 'Authorization: Bearer <your_api_token> kết hợp tiêu đề Accept: application/json', 'is_correct' => true],
                                ['content' => 'X-Secret-Password: my_default_password_123', 'is_correct' => false],
                                ['content' => 'Gửi mật khẩu trực tiếp bằng tham số trên thanh URL: ?password=admin', 'is_correct' => false],
                                ['content' => 'Không cần gửi header gì vì trình duyệt sẽ tự gõ thần kì', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Trong Laravel 11/12/13, khai báo middleware("throttle:5,1") trên tuyến đường API Route có mục đích kỹ thuật gì?',
                            'ai_insight' => 'Throttle giới hạn tần suất gọi nhằm ngăn ngừa Brute-Force và DDOS tấn công hệ thống.',
                            'answers' => [
                                ['content' => 'Giới hạn tần suất gọi API (Rate Limiting) tối đa 5 yêu cầu trong vòng 1 phút từ cùng một địa chỉ khách', 'is_correct' => true],
                                ['content' => 'Bắt buộc máy chủ phải chờ đủ 5 phút mới cho trả lời lại Client', 'is_correct' => false],
                                ['content' => 'Tự động phân phát 5 gigabytes băng thông miễn phí cho khách hàng', 'is_correct' => false],
                                ['content' => 'Xóa sạch đệm bộ nhớ của Database sau mỗi 1 phút', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Để chống lại các cuộc tấn công CSRF (Cross-Site Request Forgery) trong ứng dụng SPA kết nối Laravel Sanctum, cơ chế xác thực nào được triển khai cho stateful domains?',
                            'ai_insight' => 'Sanctum sử dụng csrf-cookie endpoint để thiết lập cookie XSRF-TOKEN bảo mật kép.',
                            'answers' => [
                                ['content' => 'Truy cập endpoint /sanctum/csrf-cookie trước khi xác thực để thu nhận cookie XSRF-TOKEN bảo mật', 'is_correct' => true],
                                ['content' => 'Đăng tải toàn bộ mật khẩu người dùng công khai lên trang Wikipedia', 'is_correct' => false],
                                ['content' => 'Yêu cầu học viên gọi điện thoại cho tổng đài để lấy mã pin xác nhận mỗi cú bấm', 'is_correct' => false],
                                ['content' => 'Dùng thư viện JQuery 1.2 cổ điển từ năm 2008 để chống lại toàn bộ hacker', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Trong Middleware của Next.js, cách viết phương thức điều hướng người dùng chưa đăng nhập về trang Login hợp lệ là gì?',
                            'ai_insight' => 'NextResponse.redirect yêu cầu đối tượng URL tuyệt đối hợp lệ trong không gian Next.',
                            'answers' => [
                                ['content' => 'return NextResponse.redirect(new URL("/login", request.url))', 'is_correct' => true],
                                ['content' => 'return echo("Xin vui lòng đăng nhập trước!");', 'is_correct' => false],
                                ['content' => 'window.location.href = "/login";', 'is_correct' => false],
                                ['content' => 'throw new Error("You are locked out!");', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Thuật ngữ CORS (Cross-Origin Resource Sharing) trong bảo mật API đóng vai trò kiểm duyệt gì?',
                            'ai_insight' => 'CORS là cơ chế an toàn trình duyệt nhằm kiểm soát việc đọc dữ liệu xuyên tên miền.',
                            'answers' => [
                                ['content' => 'Quy định các tên miền (domain) ngoại vi nào được phép gọi HTTP Request để đọc tài nguyên từ máy chủ backend của bạn', 'is_correct' => true],
                                ['content' => 'Một tính năng tạo ảnh avatar ngẫu nhiên bằng công nghệ AI Co-Pilot', 'is_correct' => false],
                                ['content' => 'Tự động mở loa phát nhạc lót nền mỗi khi bấm gửi nút đăng ký', 'is_correct' => false],
                                ['content' => 'Cơ chế nén file hình ảnh PNG xuống 10 kilobyte', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Khi một kẻ tấn công thực hiện chiến dịch DDOS tràn ngập các request vào điểm truy cập AI Stream của bạn, giải pháp hạ tầng tối ưu nhất kết hợp cùng Next.js 15 là gì?',
                            'ai_insight' => 'Lớp rào cản CDN Firewall/WAF tiêu hủy lượng truy cập đen trước khi chúng tới được ứng dụng.',
                            'answers' => [
                                ['content' => 'Sử dụng hệ thống bảo vệ Edge Firewall/WAF của Cloudflare hoặc Vercel Firewall với rào chắn kiểm tra thách thức Javascript/CAPTCHA', 'is_correct' => true],
                                ['content' => 'Rút phím dây nguồn modem internet trong phòng làm việc và nghỉ lễ 3 ngày', 'is_correct' => false],
                                ['content' => 'Chuyển font chữ trang web sang màu xám ngả tối để hacker chán không tấn công nữa', 'is_correct' => false],
                                ['content' => 'Tăng số lượng thông báo lỗi console.log() trong mã nguồn trang Frontend', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Trong quy tắc bảo mật API thế kỷ 21, vì sao KHÔNG BAO GIỜ được lưu giữ các khóa nhạy cảm như OPENAI_API_KEY hoặc GEMINI_SECRET trong tệp cấu hình của Client Components?',
                            'ai_insight' => 'Mã Client được public 100% đến trình duyệt người dùng, vô hiệu hóa mọi tính năng ẩn giấu bí mật.',
                            'answers' => [
                                ['content' => 'Mã nguồn Client sẽ được đóng gói và gửi cho trình duyệt của người dùng, khiến bất kỳ ai bấm F12 xem Network/Sources cũng có thể đánh cắp khóa API trộm tài sản', 'is_correct' => true],
                                ['content' => 'Trình duyệt Chrome sẽ phát ra tiếng khóc thảm thiết nếu thấy chuỗi ký tự dài hơn 20 chữ', 'is_correct' => false],
                                ['content' => 'Khóa API sẽ bị tan chảy khi máy tính gặp thời tiết nóng hổi bức gắt', 'is_correct' => false],
                                ['content' => 'Không có vấn đề gì cả, lưu khóa bí mật trên Client là thực hành tốt nhất (Best Practice)', 'is_correct' => false],
                            ]
                        ],
                        [
                            'content' => 'Trong quy trình gia hạn bảo mật Token của Laravel Sanctum (Token Expire & Renew), phương thức nào giúp đảm bảo phiên của người học không bị gián đoạn ngắt giữa chừng khi làm bài kiểm tra dài?',
                            'ai_insight' => 'Refresh token ngầm qua HttpOnly Cookie đảm bảo an toàn tuyệt đối và UX liền mạch.',
                            'answers' => [
                                ['content' => 'Sử dụng cơ chế Refresh Token ngầm qua HTTP-Only Cookie hoặc Interceptor trên axiosClient để tự động cấp mới Access Token trước thời điểm hết hạn', 'is_correct' => true],
                                ['content' => 'Bắt buộc học viên cứ mỗi 5 phút phải tự động nhấn F5 tải lại trình duyệt và gõ lại mật khẩu', 'is_correct' => false],
                                ['content' => 'Thiết lập hạn sử dụng token dài tới 1000 năm trong bảng cấu hình database', 'is_correct' => false],
                                ['content' => 'Không sử dụng token hay mật khẩu nữa, mở tự do toàn bộ endpoint cho tất cả khách', 'is_correct' => false],
                            ]
                        ]
                    ]
                ]
            ];

            $orderIndex = 1;
            foreach ($assessments as $item) {
                // 1. Create Lesson in Database
                $lesson = Lesson::create([
                    'course_id' => $item['course_id'],
                    'module_id' => $item['module_id'],
                    'title' => $item['lesson_title'],
                    'type' => 'quiz_module',
                    'content' => $item['description'],
                    'duration_seconds' => $item['time_limit'] * 60,
                    'order' => $orderIndex++,
                    'status' => 'published'
                ]);

                // 2. Create Quiz in Database
                $quiz = Quiz::create([
                    'lesson_id' => $lesson->id,
                    'title' => $item['lesson_title'],
                    'time_limit_minutes' => $item['time_limit'],
                    'passing_score' => $item['passing_score']
                ]);

                // 3. Create Questions & Answers in Database
                $qOrder = 1;
                foreach ($item['questions'] as $qData) {
                    $question = Question::create([
                        'quiz_id' => $quiz->id,
                        'content' => $qData['content'],
                        'ai_insight' => $qData['ai_insight'],
                        'order' => $qOrder++
                    ]);

                    foreach ($qData['answers'] as $aData) {
                        Answer::create([
                            'question_id' => $question->id,
                            'content' => $aData['content'],
                            'is_correct' => $aData['is_correct']
                        ]);
                    }
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
