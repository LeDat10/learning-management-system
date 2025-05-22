import { Row, Col } from "antd";
import lmsImage from "../../../images/client/learning-management-system_pixian_ai.png";
import { Outlet } from "react-router-dom";
import "./LayoutUser.scss";

function LayoutUser() {
    return (
        <>
            <div className="layout-user">
                <Row style={{ height: "100%" }}>
                    <Col lg={12} md={24} sm={24} xs={24}>
                        <div className="layout-user__inner-content">
                            <div className="layout-user__content">
                                <Outlet />
                            </div>
                        </div>
                    </Col>

                    <Col lg={12} md={0} sm={0} xs={0}>
                        <div className="layout-user__inner-image">
                            <img className="layout-user__image" src={lmsImage} />
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default LayoutUser;