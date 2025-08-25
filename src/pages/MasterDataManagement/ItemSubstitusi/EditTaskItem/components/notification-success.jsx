const NotificationSuccess = ({ title, description }) => {
    return (
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-green-50 border border-green-200 shadow-sm">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <div>
                <span className="block text-green-700 font-semibold">{title}</span>
                <span className="block text-xs text-green-600">{description}</span>
            </div>
        </div>
  )
}

export default NotificationSuccess
