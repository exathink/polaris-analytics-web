import {List} from 'immutable';


export class ContextStack {
  constructor(stack, index) {
    this.stack = stack;
    this.index = index;
  }

  current() {
    return this.stack.size > 0 && this.index >=0 ?
      this.stack.get(this.index)
      : null;
  }

  next() {
    return this.index > 0 ?
      this.stack.get(this.index - 1)
      : null;
  }

  prev() {
    if(this.index + 1 < this.stack.size) {
      const prevEntry = this.stack.get(this.index + 1);
      const current = this.current();
      return prevEntry && current && prevEntry.context === current.context ?
        prevEntry
        : null;
    } else {
      return null;
    }
  }

  prevContextEntry() {
    const current = this.current();
    const prev = this.stack.findEntry(entry => entry.context !== current.context && !entry.context.hidden);
    return prev ? prev : []
  }

  prevContext() {
    // eslint-disable-next-line
    const [_, activeContext] = this.prevContextEntry();
    return activeContext;
  }

  static initContext() {
    return new ContextStack(new List(), -1);
  }

  static pushContext(contextStack, context) {
    if (context.equals(contextStack.prev())) {
        return new ContextStack(contextStack.stack, contextStack.index + 1)
      } else if (context.equals(contextStack.next())) {
        return new ContextStack(contextStack.stack, contextStack.index - 1)
      } else {
        const [index, prevContext] = contextStack.prevContextEntry();
        if(context.equals(prevContext)) {
          return new ContextStack(contextStack.stack.slice(index), 0)
        }
      }
      return new ContextStack(contextStack.stack.unshift(context), 0);
  }

}