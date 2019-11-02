import i18n from 'i18next';

export function buildDataCbo(key) {
    if (key === "CR_TYPE") {
        return [
            {itemId: "0", itemName: i18n.t("crManagement:crManagement.dropdown.crType.crNormal")},
            {itemId: "1", itemName: i18n.t("crManagement:crManagement.dropdown.crType.crEmergency")},
            {itemId: "2", itemName: i18n.t("crManagement:crManagement.dropdown.crType.crStandard")},
        ];
    } else if (key === "CR_SEARCH_TYPE") {
        return [
            {itemId: 0, itemName: i18n.t("crManagement:crManagement.dropdown.searchType.lookup")},
            {itemId: 5, itemName: i18n.t("crManagement:crManagement.dropdown.searchType.createEdit")},
            {itemId: 1, itemName: i18n.t("crManagement:crManagement.dropdown.searchType.approve")},
            {itemId: 2, itemName: i18n.t("crManagement:crManagement.dropdown.searchType.verify")},
            {itemId: 3, itemName: i18n.t("crManagement:crManagement.dropdown.searchType.consider")},
            {itemId: 9, itemName: i18n.t("crManagement:crManagement.dropdown.searchType.waitCab")},
            {itemId: 10, itemName: i18n.t("crManagement:crManagement.dropdown.searchType.cab")},
            {itemId: 4, itemName: i18n.t("crManagement:crManagement.dropdown.searchType.schedule")},
            {itemId: 12, itemName: i18n.t("crManagement:crManagement.dropdown.searchType.qltd")},
            {itemId: 6, itemName: i18n.t("crManagement:crManagement.dropdown.searchType.excute")},
            {itemId: 11, itemName: i18n.t("crManagement:crManagement.dropdown.searchType.z78")},
            {itemId: 7, itemName: i18n.t("crManagement:crManagement.dropdown.searchType.resolve")},
            {itemId: 8, itemName: i18n.t("crManagement:crManagement.dropdown.searchType.close")},
        ];
    } else if (key === "RISK") {
        return [
            {itemId: "1", itemName: "1"},
            {itemId: "2", itemName: "2"},
            {itemId: "3", itemName: "3"},
            {itemId: "4", itemName: "4"},
        ];
    } else if (key === "STATE") {
        return [
            {itemId: "1", itemName: i18n.t("crManagement:crManagement.dropdown.state.open"), itemCode: "CR_APPROVE"},
            {itemId: "2", itemName: i18n.t("crManagement:crManagement.dropdown.state.queue"), itemCode: "CR_QLTD"},
            {itemId: "3", itemName: i18n.t("crManagement:crManagement.dropdown.state.coordinate"), itemCode: "CR_CHTH"},
            {itemId: "4", itemName: i18n.t("crManagement:crManagement.dropdown.state.evaluate"), itemCode: "CR_QLTD,CR_CAB"},
            {itemId: "11", itemName: i18n.t("crManagement:crManagement.dropdown.state.waitCab"), itemCode: "CR_QLTD,CR_CAB"},
            {itemId: "12", itemName: i18n.t("crManagement:crManagement.dropdown.state.cab"), itemCode: "CR_CAB"},
            {itemId: "5", itemName: i18n.t("crManagement:crManagement.dropdown.state.approve"), itemCode: "CR_EXCUTE"},
            {itemId: "6", itemName: i18n.t("crManagement:crManagement.dropdown.state.accept"), itemCode: "CR_EXCUTE"},
            {itemId: "7", itemName: i18n.t("crManagement:crManagement.dropdown.state.resolve"), itemCode: "CR_QLTD_APP"},
            {itemId: "9", itemName: i18n.t("crManagement:crManagement.dropdown.state.close"), itemCode: "CR_QLTD_APP"},
            {itemId: "8", itemName: i18n.t("crManagement:crManagement.dropdown.state.incomplete"), itemCode: "CR_Z78"},
            {itemId: "0", itemName: i18n.t("crManagement:crManagement.dropdown.state.draft"), itemCode: "CR_CREATOR"},
        ];
    } else if (key === "TITLE_ICON") {
        return [
            {itemId: "0", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.lookup")},
            {itemId: "1", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.edit")},
            {itemId: "2", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.approve")},
            {itemId: "3", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.verify")},
            {itemId: "4", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.consider")},
            {itemId: "5", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.schedule")},
            {itemId: "6", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.receive")},
            {itemId: "7", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.resolve")},
            {itemId: "8", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.close")},
            {itemId: "9", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.consider")},
            {itemId: "10", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.consider")},
            {itemId: "11", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.receive")},
            {itemId: "12", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.receive")},
            {itemId: "13", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.receive")},
            {itemId: "14", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.receive")},
            {itemId: "15", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.receive")},
            {itemId: "16", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.approve")},
            {itemId: "17", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.receive")},
            {itemId: "18", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.receive")},
            {itemId: "19", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.receive")},
            {itemId: "20", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.schedule")},
            {itemId: "21", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.schedule")},
            {itemId: "22", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.receive")},
            {itemId: "23", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.receive")},
            {itemId: "24", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.receive")},
            {itemId: "26", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.edit")},
            {itemId: "27", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.receive")},
            {itemId: "28", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.assignCab")},
            {itemId: "29", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.cab")},
            {itemId: "30", itemName: i18n.t("crManagement:crManagement.dropdown.titleIcon.editByQltd")}
        ];
    } else if (key === "ACTION_RIGHT") {
        return {
            LOOKUP_ONLY: "0",
            CAN_EDIT: "1",
            CAN_APPROVE: "2",
            CAN_VERIFY: "3",
            CAN_CONSIDER: "4",
            CAN_SCHEDULE: "5",
            CAN_RECEIVE: "6",
            CAN_RESOLVE: "7",
            CAN_CLOSE: "8",
            CAN_CONSIDER_NO_APPRAISE: "9",
            CAN_CONSIDER_NO_ASSIGNEE: "10",
            CAN_RECEIVE_NO_ACCEPT: "11",
            CAN_RECEIVE_NO_ASSIGNEE: "12",
            CAN_RECEIVE_STANDARD: "13", // Duoc: dong' CR/Tiep nhan CR/Giao nhan vien CR | Tiep nhan CR chuan muc truong don vi full quyá»�n (1)
            CAN_RECEIVE_STANDARD_NO_ACCEPT: "14",//Duoc: dong' CR/Giao nhan vien CR| Tiep nhan CR chuan muc truong don vi khÃ´ng Tiep nhan (2)
            CAN_RECEIVE_STANDARD_NO_ASSIGNEE: "15",//Duoc: dong' CR/Tiep nhan CR| Tiep nhan CR chuan muc nhan vien khong giao cho ai (3)
            CAN_APPROVE_STANDARD: "16",// Duoc: duyet CR/ cap nhat CR/CLose CR/Resolve CR/Incomplete CR | Phe duyet CR chuan (4)
            CAN_RECEIVE_EMR: "17",//Duoc giao/Nhan CR/YC sap lich lai| Tiep nhan CR khan muc truong don vi full quyen (5)
            CAN_RECEIVE_EMR_NO_ACCEPT: "18",//Giao thuc thi/YC sap lich lai| Tiep nhan CR khan muc truong don vi khong Tiep nhan(6)
            CAN_RECEIVE_EMR_NO_ASSIGNEE: "19",//Nhan thuc thi CR/YC sap lich lai| Tiep nhan CR khan muc nhan vien khong giao cho ai(7)
            CAN_SCHEDULE_EMR: "20",//Duoc sap lich thuc hien CR (khong cho phÃ©p tra ve don vi nÃ o) | Sap lich CR khan(8)
            CAN_SCHEDULE_PREAPPROVE: "21",//Duoc sap lich thuc hien CR preApprove (khong cho phep tra ve don vi tham dinh)
            CAN_RECEIVE_PREAPPROVE: "22",//Tiep nhan CR, giao nhan vien, tra ve don vi QLTD, khong tra ve don vi tham dinh
            CAN_RECEIVE_PREAPPROVE_NO_ACCEPT: "23",// Giao nhan vien, tra ve don vi QLTD, khong tra ve don vi tham dinh, khong Tiep nhan
            CAN_RECEIVE_PREAPPROVE_NO_ASSIGNEE: "24",// Tiep nhan CR, Tiep nhan, tra ve don vi QLTD, khong tra ve don vi tham dinh, khong giao viec
            CAN_ONLY_ADDWORKLOG: "26",// Chi cap nhat WorkLog. Danh cho CAB,Z78
            CAN_ONLY_REASSIGN: "27",//Khi da co nhan vien tiep nhan va thoi gian hien tai < start_time CR thi cho phep truong phong re-assign viec cho nhan vien 
            CAN_ASSIGN_CAB: "28",
            CAN_CAB: "29",
            CAN_EDIT_CR_BY_QLTD: "30"
        }
    } else if (key === "PRIORITY") {
        return [
            {itemId: "3", itemName: i18n.t("crManagement:crManagement.dropdown.priority.imediately")},
            {itemId: "0", itemName: i18n.t("crManagement:crManagement.dropdown.priority.high")},
            {itemId: "1", itemName: i18n.t("crManagement:crManagement.dropdown.priority.low")},
            {itemId: "2", itemName: i18n.t("crManagement:crManagement.dropdown.priority.medium")},
        ];
    } else if (key === "CR_RELATED") {
        return [
            {itemId: "0", itemName: i18n.t("crManagement:crManagement.dropdown.crRelated.nonRelated")},
            {itemId: "1", itemName: i18n.t("crManagement:crManagement.dropdown.crRelated.primary")},
            {itemId: "2", itemName: i18n.t("crManagement:crManagement.dropdown.crRelated.secondary")},
            {itemId: "4", itemName: i18n.t("crManagement:crManagement.dropdown.crRelated.isPreApprove")},
            {itemId: "3", itemName: i18n.t("crManagement:crManagement.dropdown.crRelated.preApprove")},
        ];
    } else if (key === "CR_CONFIG") {
        return {
            VMSA_SUCCESS_KEY: 0,
            VMSA_FAIL_KEY: 1,
            CRGNOC_KEY: "CR_GNOC",
            WAITING_MOP_STATUS: "1",
            TYPE_NUMBER: "LONG,INTEGER,SHORT,BYTE,INT,DOUBLE,FLOAT",
            TYPE_STRING: "STRING",
            NUMBER: "NUMBER",
            NUMBER_DOUBLE: "DOUBLE",
            TYPE_DATE: "DATE",
            SAVING_NODE_WITH_FULL_INFO_MODE: "1"
        };
    } else if (key === "SYSTEM") {
        return [
            {itemId: "2", itemName: "PT"},
            {itemId: "3", itemName: "TT"},
            {itemId: "4", itemName: "WO"},
            {itemId: "5", itemName: "SR"},
            {itemId: "6", itemName: "RDM"},
            {itemId: "7", itemName: "RR"},
        ];
    } else if (key === "ACTION_CODE") {
        return {
            ADDNEW: {itemId: "0", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.addNew")},
            UPDATE: {itemId: "1", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.update")},
            APPROVE: {itemId: "2", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.approve")},
            REJECT: {itemId: "3", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.reject")},
            CLOSE_BY_MANAGER: {itemId: "6", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.closeByManager")},
            RETURN_TO_CREATOR_BY_MANAGER: {itemId: "7", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.returnToCreatorByManager")},
            ASSIGN_TO_CONSIDER: {itemId: "8", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.assignToConsider")},
            CHANGE_CR_TYPE: {itemId: "9", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.changeType")},
            CLOSE_BY_APPRAISER: {itemId: "10", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.closeByAppraisal")},
            RETURN_TO_CREATOR_BY_APPRAISER: {itemId: "11", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.returnToCreatorByAppraisal")},
            RETURN_TO_MANAGER_BY_APPRAISER: {itemId: "12", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.returnToManagerByAppraisal")},
            APPRAISE: {itemId: "14", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.consider")},
            ASSIGN_TO_EMPLOYEE_APPRAISAL: {itemId: "15", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.assignToEmpl")},
            ACCEPT: {itemId: "16", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.accept")},
            RETURN_TO_MANAGER_BY_IMPL: {itemId: "17", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.returnToManagerByEmpl")},//tra ve QLTD
            RETURN_TO_APPRAISER_BY_IMPL: {itemId: "18", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.returnToConsiderByEmpl")},//tra ve QLTH
            RETURN_TO_CREATOR_BY_MANAGER_SCH: {itemId: "19", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.returnToCreatorByManagerSch")},
            RETURN_TO_APPRAISE_BY_MANAGER_SCH: {itemId: "20", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.returnToConsiderByManagerSch")},
            CLOSE_BY_MANAGER_SCH: {itemId: "21", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.closeByManagerSch")},
            SCHEDULE: {itemId: "22", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.schedule")},
            ASSIGN_EXC_TO_EMPLOYEE: {itemId: "23", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.assignExcuteToEmpl")},
            RESOLVE: {itemId: "24", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.resolve")},
            CLOSECR: {itemId: "25", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.close")},
            CLOSECR_APPROVE_STD: {itemId: "26", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.close")}, // dong CR luc duyet Standard â€“ phuc vu thang (16)
            RESOLVE_APPROVE_STD: {itemId: "27", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.resolve")},// Resolve CR luc duyet Standard phuc vu thang (13)(14)(15)
            INCOMPLETE_APPROVE_STD: {itemId: "28", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.returnToCreatorByApprove")},// Incomplate CR luc duyet Standard phuc vu thang (16)
            CLOSE_EXCUTE_STD: {itemId: "29", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.close")},// phuc vu thang (13)(14)(15)
            ACCEPT_BY_MANAGER_PRE: {itemId: "30", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.acceptByManagePreapprove")},
            UPDATE_CR_WHEN_APPROVE_STD: {itemId: "31", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.updateCrWhenApproveStd")},// sua thong tin CR STANDARD khi phe duyet
            SAVEDRAFT: {itemId: "32", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.saveDraft")},
            CANCELCR: {itemId: "33", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.cancel")},
            UPDATE_CR_WHEN_RECEIVE_STD: {itemId: "34", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.updateCrWhenReceiveStd")},// sua thong tin CR STANDARD khi tiep nhan
            REJECT_EXCUTE_STD: {itemId: "35", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.rejectWhenReceiveStd")},// nhan vien tu choi nhan CR STANDARD 
            RETURN_TO_CREATOR_WHEN_EXCUTE_STD: {itemId: "36", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.returnToCreatorByExcutor")},// Tra ve dv tao khi tiep nhan thu thi CR 
            CLOSE_EXCUTE_EMERGENCY: {itemId: "37", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.closeEmergency")},// Tu choi CR khan{itemId: "0", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.")}, Dong CR 
            CHANGE_TO_CAB: {itemId: "38", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.changeToCab")},
            ASSIGN_TO_CAB: {itemId: "39", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.assignToCab")},
            CAB: {itemId: "40", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.cab")},
            RETURN_TO_CREATOR_WHEN_CAB: {itemId: "41", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.returnToCreatorByCap")},
            RETURN_TO_CONSIDER_WHEN_CAB: {itemId: "42", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.returnToConsiderByCap")},
            RETURN_TO_MANAGE_WHEN_CAB: {itemId: "43", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.returnToManageByCap")},
            EDIT_CR_BY_QLTD: {itemId: "44", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.editByManage")},
            CHANGE_TO_SCHEDULE: {itemId: "45", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.changeToSchedule")},
            RETURN_TO_CAB_WHEN_SCHEDULE: {itemId: "46", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.returnToCabWhenSchedule")},
            RETURN_TO_CREATOR_BY_MANAGER_CAB: {itemId: "47", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.returnToCreatorByManagerCab")},
            RETURN_TO_APPRAISE_BY_MANAGER_CAB: {itemId: "48", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.returnToConsiderByManagerCab")},
            CLOSE_BY_MANAGER_CAB: {itemId: "49", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.closeByManagerCab")},
            RESOLVE_WITH_FAILT_STATUS_DUE_TO_WO: {itemId: "50", itemName: i18n.t("crManagement:crManagement.dropdown.actionCode.resolveCrWithFailStatusByUser")},
        };
    } else if (key === "APPROVAL_STATUS") {
        return [
            {itemId: "0", itemName: i18n.t("crManagement:crManagement.dropdown.approvalStatus.waitting")},
            {itemId: "1", itemName: i18n.t("crManagement:crManagement.dropdown.approvalStatus.approved")},
            {itemId: "2", itemName: i18n.t("crManagement:crManagement.dropdown.approvalStatus.rejected")},
        ];
    }
    return [];
}