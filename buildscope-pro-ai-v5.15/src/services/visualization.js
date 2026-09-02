export function buildVisualizationRequest({projectId,spaceType,sourceUri,styleNotes}){
  return {
    projectId,
    spaceType,
    sourceUri,
    styleNotes,
    status:"ready_for_ai",
    createdAt:new Date().toISOString()
  };
}
