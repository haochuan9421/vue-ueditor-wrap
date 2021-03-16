import { PropType, CSSProperties, defineComponent } from 'vue';

export type ButtonType = 'primary' | 'success' | 'warning' | 'danger';

export default defineComponent({
  name: 'VueUeditorWrap',

  props: {
    text: String,
    color: String,
    type: {
      type: String as PropType<ButtonType>,
      default: 'primary',
    },
  },

  emits: ['click'],

  setup(props, { emit, slots }) {
    const onClick = (event: MouseEvent) => {
      emit('click', event);
    };

    const renderText = () => {
      const text = slots.default ? slots.default() : props.text;

      if (text) {
        return <span>{text}</span>;
      }
    };

    const getStyle = () => {
      const { color } = props;
      if (color) {
        const style: CSSProperties = {};
        style.color = color;
        return style;
      }
    };

    const classes = ['demo-button', props.type];

    return () => {
      return (
        <button class={classes} style={getStyle()} onClick={onClick}>
          {renderText()}
        </button>
      );
    };
  },
});
