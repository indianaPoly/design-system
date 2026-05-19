type SupportedInternals = ElementInternals & {
  setFormValue: (value: string | File | FormData | null) => void;
};

type ValidityInternals = ElementInternals & {
  setValidity: (
    flags?: ValidityStateFlags,
    message?: string,
    anchor?: HTMLElement,
  ) => void;
};

export const supportsFormValue = (
  internals: ElementInternals | null,
): internals is SupportedInternals => typeof (internals as Partial<SupportedInternals> | null)?.setFormValue === 'function';

export const supportsSetValidity = (
  internals: ElementInternals | null,
): internals is ValidityInternals => typeof (internals as Partial<ValidityInternals> | null)?.setValidity === 'function';

export const syncHiddenFormProxy = ({
  host,
  proxyInput,
  name,
  value,
  shouldSubmit,
}: {
  host: HTMLElement,
  proxyInput: HTMLInputElement | null,
  name: string,
  value: string,
  shouldSubmit: boolean,
}) => {
  if (!shouldSubmit && !proxyInput) {
    return null;
  }

  const nextProxy = proxyInput ?? document.createElement('input');

  if (!proxyInput) {
    nextProxy.type = 'hidden';
    nextProxy.hidden = true;
    nextProxy.tabIndex = -1;
    nextProxy.slot = 'form-proxy';
    nextProxy.setAttribute('aria-hidden', 'true');
    nextProxy.setAttribute('data-ds-form-proxy', 'true');
    host.append(nextProxy);
  }

  nextProxy.disabled = !shouldSubmit;
  nextProxy.name = shouldSubmit ? name : '';
  nextProxy.value = value;

  return nextProxy;
};

export const bindFormReset = (
  form: HTMLFormElement | null,
  onReset: () => void,
  teardown: (() => void) | null,
) => {
  teardown?.();

  if (!form) {
    return null;
  }

  const handleReset = () => {
    queueMicrotask(onReset);
  };

  form.addEventListener('reset', handleReset);
  return () => {
    form.removeEventListener('reset', handleReset);
  };
};
