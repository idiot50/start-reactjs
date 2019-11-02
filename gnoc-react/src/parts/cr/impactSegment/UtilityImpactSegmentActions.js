import * as types from './UtilityImpactSegmentTypes';
import FileSaver from 'file-saver';

export function searchUtilityImpactSegment(data) {
  return {
    type: types.UTILITY_IMPACTSEGMENT_SEARCH,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrImpactSegment/getListImpactSegment',
        data: data
      }
    }
  };
}

export function getDetailUtilityImpactSegment(utilityImpactSegmentId) {
  return {
    type: types.UTILITY_IMPACTSEGMENT_GET_DETAIL,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'GET',
        url:'/CrImpactSegment/getDetail?impactSegmentId=' + utilityImpactSegmentId
      }
    }
  };
}

export function addUtilityImpactSegment(data) {
  return {
    type: types.UTILITY_IMPACTSEGMENT_ADD,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'POST',
        url:'/CrImpactSegment/addImpactSegment',
        data: data
      }
    }
  };
}

export function editUtilityImpactSegment(data) {
  return {
    type: types.UTILITY_IMPACTSEGMENT_EDIT,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'PUT',
        url:'/CrImpactSegment/updateImpactSegment',
        data: data
      }
    }
  };
}

export function deleteUtilityImpactSegment(utilityImpactSegmentId) {
  return {
    type: types.UTILITY_IMPACTSEGMENT_DELETE,
    payload: {
      client: 'cr_cat',
      request:{
        method: 'DELETE',
        url:'/CrImpactSegment/deleteImpactSegment?impactSegmentId=' + utilityImpactSegmentId
      }
    }
  };
}
