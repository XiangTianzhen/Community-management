import { createVNode, render } from 'vue';
import MessageComponent from '../components/Message.vue';

// 消息实例列表
const instances = [];
let seed = 1;

// 创建并显示消息
const Message = function(options) {
  if (typeof options === 'string') {
    options = {
      content: options
    };
  }
  
  const id = `message_${seed++}`;
  const container = document.createElement('div');
  
  const props = {
    ...options,
    id,
    onClose: () => {
      close(id);
    }
  };
  
  const vnode = createVNode(MessageComponent, props);
  render(vnode, container);
  document.body.appendChild(container);
  
  const instance = {
    id,
    vnode,
    container
  };
  
  instances.push(instance);
  return instance;
};

// 关闭指定消息
const close = function(id) {
  const index = instances.findIndex(instance => instance.id === id);
  if (index === -1) return;
  
  const { container } = instances[index];
  instances.splice(index, 1);
  
  // 延迟移除DOM元素，确保动画完成
  setTimeout(() => {
    render(null, container);
    document.body.removeChild(container);
  }, 300);
};

// 清除所有消息
Message.closeAll = function() {
  instances.forEach(instance => {
    instance.vnode.component.exposed.close();
  });
};

// 不同类型的消息快捷方法
['success', 'warning', 'info', 'error'].forEach(type => {
  Message[type] = options => {
    if (typeof options === 'string') {
      options = {
        content: options
      };
    }
    options.type = type;
    return Message(options);
  };
});

export default Message; 