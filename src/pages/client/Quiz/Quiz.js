import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestion } from "../../../services/client/questionService";
import { Button, Checkbox, Col, Flex, message, Progress, Radio, Row, Statistic, Tooltip } from "antd";
import { getAnswersSaved, saveAnswer, submitQuiz } from "../../../services/client/answerService";
import "./Quiz.scss";

function Quiz() {
    const [questions, setQuestions] = useState([]);
    const params = useParams();
    const lessonId = params.lessonId;
    const [currentIndex, setCurrentIndex] = useState(0);
    const attemptId = localStorage.getItem("attemptId");
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [deadline, setDeadline] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        const questionsRes = await getQuestion(lessonId, attemptId);
        const answersRes = await getAnswersSaved(attemptId);

        if (answersRes.code === 200) {
            const selectedAnswersMap = answersRes.answers.reduce((acc, curr) => {
                acc[curr.questionId] = curr.selectedAnswers;
                return acc;
            }, {});
            setSelectedAnswers(selectedAnswersMap);
        }

        if (questionsRes.code === 200) {
            setQuestions(questionsRes.data.questions);
            setDeadline(new Date(questionsRes.data.startedAt).getTime() + 1000 * 60 * questionsRes.data.duration);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const selectedCount = Object.keys(selectedAnswers).length;

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleSubmited = async () => {
        const result = await submitQuiz({
            attemptId: attemptId,
            lessonId: lessonId
        });

        if (result.code === 200) {
            message.success(result.message);
            if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen(); // Safari
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen(); // IE11
                }
            }
            navigate(-1);
        } else {
            message.error(result.message);
        }
    };

    return (
        <>
            <div className="quiz">
                {questions.length > 0 && (
                    <>
                        <Row gutter={[26, 26]} style={{
                            height: "100%"
                        }}>
                            <Col xl={18} lg={16} md={14} sm={24} xs={24}>
                                <div className="quiz__left">
                                    <div className="quiz__question">
                                        {questions[currentIndex].content}
                                    </div>

                                    <div className="quiz__answers">
                                        {questions[currentIndex].questionType === 'multiple' ? (
                                            <>
                                                <Checkbox.Group
                                                    style={{ width: '100%' }}
                                                    onChange={async (checkedValues) => {
                                                        await saveAnswer({
                                                            questionId: questions[currentIndex]._id,
                                                            attemptId: attemptId,
                                                            selectedAnswers: checkedValues
                                                        });

                                                        setSelectedAnswers(prev => ({
                                                            ...prev,
                                                            [questions[currentIndex]._id]: checkedValues
                                                        }));
                                                    }}
                                                    value={selectedAnswers[questions[currentIndex]._id] || []}

                                                >
                                                    {questions[currentIndex].answers.map((answer, index) => (
                                                        <Checkbox
                                                            key={index}
                                                            value={answer._id}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                width: '100%',
                                                                marginBottom: 8,
                                                            }}
                                                            className="quiz__answer"
                                                        >
                                                            {answer.text}
                                                        </Checkbox>
                                                    ))}
                                                </Checkbox.Group>
                                            </>

                                        ) : (
                                            <>
                                                <Radio.Group
                                                    onChange={async (checkedValues) => {
                                                        await saveAnswer({
                                                            questionId: questions[currentIndex]._id,
                                                            attemptId: attemptId,
                                                            selectedAnswers: [checkedValues.target.value]
                                                        });

                                                        setSelectedAnswers(prev => ({
                                                            ...prev,
                                                            [questions[currentIndex]._id]: [checkedValues.target.value]
                                                        }));
                                                    }}
                                                    value={selectedAnswers[questions[currentIndex]._id]?.[0] || ""}

                                                >
                                                    {questions[currentIndex].answers.map((answer, index) => (
                                                        <Radio className="quiz__answer" key={index} style={{
                                                            display: "block",
                                                            width: "100%"
                                                        }}
                                                            value={answer._id}
                                                        >
                                                            {answer.text}
                                                        </Radio>
                                                    ))}
                                                </Radio.Group>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Col>

                            <Col xl={6} lg={8} md={10} sm={24} xs={24}>
                                <div className="quiz__right">
                                    <Statistic.Countdown title="Thời gian còn lại" value={deadline} onFinish={handleSubmited} />
                                    <div className="quiz__progress">
                                        <div className="quiz__count">
                                            <span>Tiến trình làm bài:</span>
                                            <span className="quiz__number-selected">{selectedCount}/{questions.length}</span>
                                        </div>
                                        <Progress percent={((selectedCount / questions.length) * 100).toFixed(0)} percentPosition={{ align: 'center', type: 'inner' }} size={["100%", 20]} />
                                    </div>

                                    <div className="quiz__box-question">

                                        <div className="quiz__question-number">
                                            <Flex wrap gap="small">
                                                {questions.map((q, index) => {
                                                    const isCurrent = currentIndex === index;
                                                    const isAnswered = selectedAnswers.hasOwnProperty(q._id);

                                                    const color = isCurrent || isAnswered ? "primary" : "default";
                                                    const variant = isCurrent ? "solid" : "filled";
                                                    return (
                                                        <Tooltip title={`Câu ${index + 1}`} key={index}>
                                                            <Button
                                                                shape="circle"
                                                                size="large"
                                                                onClick={() => setCurrentIndex(index)}
                                                                color={color}
                                                                variant={variant}
                                                            >
                                                                {index + 1}
                                                            </Button>
                                                        </Tooltip>
                                                    );
                                                })}
                                            </Flex>
                                        </div>
                                    </div>

                                    <div className="quiz__button-submited">
                                        <Button
                                            onClick={handleSubmited}
                                            block
                                            type="primary"
                                            size="large"
                                        >
                                            Nộp bài
                                        </Button>
                                    </div>

                                    <div className="quiz__note">
                                        <div className="quiz__note-item">
                                            <Button
                                                shape="circle"
                                                size="large"
                                                variant="filled"
                                                color="default"
                                            >
                                                {questions.length - selectedCount || 0}
                                            </Button>

                                            <span className="quiz__note-content">Câu hỏi chưa hoàn thành</span>
                                        </div>

                                        <div className="quiz__note-item">
                                            <Button
                                                shape="circle"
                                                size="large"
                                                variant="filled"
                                                color="primary"
                                            >
                                                {selectedCount || 0}
                                            </Button>

                                            <span className="quiz__note-content">Câu hỏi đã hoàn thành</span>
                                        </div>

                                        <div className="quiz__note-item">
                                            <Button
                                                shape="circle"
                                                size="large"
                                                variant="solid"
                                                color="primary"
                                            >
                                                {currentIndex + 1}
                                            </Button>

                                            <span className="quiz__note-content">Câu hỏi hiện tại</span>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className="quiz__pagination">
                            <Button
                                size="large"
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                                style={{ marginRight: 8 }}
                                variant="filled"
                                color="primary"
                            >
                                Quay lại
                            </Button>
                            <Button
                                size="large"
                                type="primary"
                                onClick={handleNext}
                                disabled={currentIndex === questions.length - 1}
                            >
                                Mục tiếp
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Quiz;