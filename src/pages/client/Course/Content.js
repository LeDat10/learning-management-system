import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDetailSection } from "../../../services/client/sectionService";
import { getDetailLesson } from "../../../services/client/lessonService";
import { Button, Card, Col, message, Row } from "antd";
import parser from "html-react-parser";
import "./Course.scss";
import { createQuizAttempt } from "../../../services/client/quizAttemptService";
import moment from "moment";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import "github-markdown-css/github-markdown-light.css";

function Content() {
  const params = useParams();
  const { courseId, sectionId, lessonId } = params;
  const [content, setContent] = useState({});
  const navigate = useNavigate();

  const fetchAPI = async () => {
    if (!lessonId || lessonId === "null") {
      if (courseId && sectionId) {
        const result = await getDetailSection(courseId, sectionId);
        if (result.code === 200) {
          setContent(result.section);
        }
      }
    } else {
      if (sectionId) {
        const result = await getDetailLesson(sectionId, lessonId);
        if (result.code === 200) {
          setContent(result.lesson);
        }
      }
    }
  };

  useEffect(() => {
    fetchAPI();
  }, [courseId, sectionId, lessonId]);

  useEffect(() => {
    hljs.highlightAll(); // ✅ Gọi sau khi content đã được set và render
  }, [content]);

  const handletoWork = async () => {
    const result = await createQuizAttempt({
      lessonId: lessonId,
    });
    if (result.code === 200) {
      localStorage.setItem("attemptId", result.attemptId);
      const elem = document.documentElement; // hoặc chọn phần tử cụ thể bạn muốn fullscreen
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        // Safari
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        // IE11
        elem.msRequestFullscreen();
      }
      navigate(`/quiz/${content._id}`);
    } else {
      message.error(result.message);
    }
  };

  return (
    <>
      <div className="content__card">
        <Card>
          <h2 className="content__card-title">{content.title}</h2>

          <div className="content__body markdown-body">
            {parser(content.description || content.content || "")}
          </div>

          {content.type === "quiz" && (
            <div className="content__body">
              <div className="content__item">
                <span className="content__label">Câu hỏi: </span>
                <span className="content__content">
                  {content?.totalQuestions || 0}
                </span>
              </div>

              <div className="content__item">
                <span className="content__label">Thời gian làm bài: </span>
                <span className="content__content">
                  {content?.duration || 0}
                </span>
              </div>

              <div className="content__item">
                <span className="content__label">Số lần làm bài tối đa: </span>
                <span className="content__content">
                  {content?.maxAttempts || 0}
                </span>
              </div>

              <div className="content__item">
                <span className="content__label">Số lần đã làm bài: </span>
                <span className="content__content">
                  {content?.attempt || 0}
                </span>
              </div>

              <div className="content__item">
                <span className="content__label">Số câu đã trả lời: </span>
                <span className="content__content">
                  {content?.totalAnswers || 0}
                </span>
              </div>

              <div className="content__item">
                <span className="content__label">Đáp án đúng: </span>
                <span className="content__content">
                  {content?.correctCount || 0}
                </span>
              </div>

              <div className="content__item">
                <span className="content__label">Điểm số: </span>
                <span className="content__content">{content?.score || 0}</span>
              </div>

              <div className="content__item">
                <span className="content__label">Tỉ lệ đạt: </span>
                <span className="content__content">
                  {content?.percentageScore || 0}%
                </span>
              </div>

              <div className="content__item">
                <span className="content__label">Thời gian bắt đầu: </span>
                <span className="content__content">
                  {moment(content?.startTime).format("DD/MM/YYYY hh:mm A")}
                </span>
              </div>

              <div className="content__item">
                <span className="content__label">Thời gian hết hạn: </span>
                <span className="content__content">
                  {moment(content?.endTime).format("DD/MM/YYYY hh:mm A")}
                </span>
              </div>

              <div className="content__button-quiz">
                <Row gutter={[20, 20]}>
                  <Col>
                    <Button size="large" variant="filled" color="primary">
                      Xem lại đáp án
                    </Button>
                  </Col>

                  <Col>
                    <Button onClick={handletoWork} size="large" type="primary">
                      Làm bài
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

export default Content;
