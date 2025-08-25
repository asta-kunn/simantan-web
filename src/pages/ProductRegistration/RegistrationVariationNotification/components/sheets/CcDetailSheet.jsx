// import { useUIStore } from "@/stores/uiStore";
// import { Badge } from "@/components/ui/badge";
// import CardCommon from "@/components/common/Card";
// import { sampleCcDetails } from "../../Submission/sampleSchemas";

// export const useCcDetailSheet = () => {
//   const { openSheet } = useUIStore();

//   const openCcDetailSheet = (ccData, productInfo) => {
//     const ccDetail = sampleCcDetails[ccData.ccId] || sampleCcDetails["CC-000001"];
    
//     openSheet({
//       title: "Change Control Details",
//       description: productInfo?.finishedProduct || "A-1234-00 Candesartan 16mg",
//       width: "lg",
//       children: (
//         <>
//           {/* Sticky Header - Change Control No */}
//           <div className="sticky top-0 z-[99999999] bg-white pb-4 -mx-6 px-6">
//             <div className="bg-tertiary-soft p-3 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <span className="text-sm font-medium text-gray-600">Change Control No</span>
//                 <span className="font-bold text-base">{ccDetail.ccId}</span>
//               </div>
//             </div>
//           </div>

//           {/* Scrollable Content */}
//           <div className="space-y-4 -mx-6 px-6">
//             {/* Main Details Grid */}
//             <div className="grid grid-cols-3 gap-6">
//               <div>
//                 <div className="text-gray-400 text-sm mb-1">EPI Request ID</div>
//                 <div className="font-medium text-gray-900">{ccDetail.epiRequestId}</div>
//               </div>
//               <div>
//                 <div className="text-gray-400 text-sm mb-1">EPI Category</div>
//                 <div className="font-medium text-gray-900">{ccDetail.epiCategory}</div>
//               </div>
//               <div>
//                 <div className="text-gray-400 text-sm mb-1">EPI Sub Category</div>
//                 <div className="font-medium text-gray-900">{ccDetail.epiSubCategory}</div>
//               </div>
//             </div>

//             {/* Change Title */}
//             <div className="pt-2">
//               <div className="text-gray-400 text-sm mb-1">Change Title</div>
//               <div className="font-medium text-gray-900">{ccDetail.changeTitle}</div>
//             </div>
//             <hr className="border-gray-200" />

//             {/* Second Row Details */}
//             <div className="grid grid-cols-3 gap-6 pt-4">
//               <div>
//                 <div className="text-gray-400 text-sm mb-1">Change Source</div>
//                 <div className="font-medium text-gray-900">{ccDetail.changeSource}</div>
//               </div>
//               <div>
//                 <div className="text-gray-400 text-sm mb-1">Change Trigger</div>
//                 <div className="font-medium text-gray-900">{ccDetail.changeTrigger}</div>
//               </div>
//               <div>
//                 <div className="text-gray-400 text-sm mb-1">Doc No.</div>
//                 <div className="font-medium text-gray-900">{ccDetail.docNo}</div>
//               </div>
//             </div>

//             {/* Third Row Details */}
//             <div className="grid grid-cols-3 gap-6 pt-4 pb-4">
//               <div>
//                 <div className="text-gray-400 text-sm mb-1">Registration Type</div>
//                 <div className="font-medium text-gray-900">{ccDetail.registrationType}</div>
//               </div>
//               <div>
//                 <div className="text-gray-400 text-sm mb-1">Create Task Date</div>
//                 <div className="font-medium text-gray-900">{ccDetail.createTaskDate}</div>
//               </div>
//             </div>

//             <hr className="border-gray-200" />

//             {/* Status Sections using CardCommon */}
//             <div className="space-y-4 pt-2">
//               {/* Existing Status */}
//               <CardCommon title="Existing Status" variant="light">
//                 <p className="text-sm text-gray-700 leading-relaxed">
//                   {ccDetail.existingStatus}
//                 </p>
//               </CardCommon>

//               {/* Proposed Change */}
//               <CardCommon title="Proposed Change" variant="light">
//                 <p className="text-sm text-gray-700 leading-relaxed">
//                   {ccDetail.proposedChange}
//                 </p>
//               </CardCommon>

//               {/* Change Reason/Justification */}
//               <CardCommon title="Change Reason/Justification" variant="light">
//                 <ul className="text-sm text-gray-700 space-y-2 leading-relaxed">
//                   {ccDetail.changeReasons.map((reason, index) => (
//                     <li key={index} className="flex items-start">
//                       <span className="mr-2">•</span>
//                       <span>{reason}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </CardCommon>
//             </div>
//           </div>
//         </>
//       )
//     });
//   };

//   return { openCcDetailSheet };
// };
