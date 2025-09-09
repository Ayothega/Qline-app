import { toast } from "sonner"

// In-app notification system
export const notify = {
  success: (message, options = {}) => {
    toast.success(message, {
      duration: 4000,
      position: "top-right",
      ...options,
    })
  },

  error: (message, options = {}) => {
    toast.error(message, {
      duration: 5000,
      position: "top-right",
      ...options,
    })
  },

  info: (message, options = {}) => {
    toast.info(message, {
      duration: 4000,
      position: "top-right",
      ...options,
    })
  },

  warning: (message, options = {}) => {
    toast.warning(message, {
      duration: 4000,
      position: "top-right",
      ...options,
    })
  },

  loading: (message, options = {}) => {
    return toast.loading(message, {
      position: "top-right",
      ...options,
    })
  },

  promise: (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      position: "top-right",
    })
  },

  // Queue-specific notifications
  queueJoined: (queueName, position) => {
    toast.success(`Successfully joined ${queueName}!`, {
      description: `You are #${position} in line`,
      duration: 5000,
      position: "top-right",
    })
  },

  positionUpdate: (newPosition, queueName) => {
    toast.info(`Position updated in ${queueName}`, {
      description: `You are now #${newPosition} in line`,
      duration: 4000,
      position: "top-right",
    })
  },

  yourTurn: (queueName) => {
    toast.success("It's your turn!", {
      description: `Please proceed to ${queueName}`,
      duration: 10000,
      position: "top-right",
      action: {
        label: "Acknowledge",
        onClick: () => console.log("User acknowledged their turn"),
      },
    })
  },

  queueLeft: (queueName) => {
    toast.info(`Left ${queueName}`, {
      description: "You have been removed from the queue",
      duration: 4000,
      position: "top-right",
    })
  },
}
