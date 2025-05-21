import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetailSection } from "../../../services/client/sectionService";
import { getDetailLesson } from "../../../services/client/lessonService";
import { Card, message } from "antd";
import parser from "html-react-parser";
import "./Course.scss";

function Content() {
    const params = useParams();
    const { courseId, sectionId, lessonId } = params;
    const [content, setContent] = useState({});

    const fetchAPI = async () => {
        if (!lessonId || lessonId === "null") {
            if (courseId && sectionId) {
                const result = await getDetailSection(courseId, sectionId);
                if (result.code === 200) {
                    setContent(result.section);
                } else {
                    message.error(result.message);
                }
            }
        } else {
            if (sectionId) {
                const result = await getDetailLesson(sectionId, lessonId);
                if (result.code === 200) {
                    setContent(result.lesson);
                } else {
                    message.error(result.message);
                }
            }
        }
    }

    useEffect(() => {
        fetchAPI();
    }, [courseId, sectionId, lessonId]);

    return (
        <>
            <div className="content__card">
                <Card>
                    <h2 className="content__card-title">
                        {content.title}
                    </h2>

                    <div className="content__body">
                        {parser(content.description || content.content || "")}
                    </div>
                </Card>
            </div>
        </>
    );
};

export default Content;