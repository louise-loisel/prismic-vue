import {
	AllowedComponentProps,
	ComponentCustomProps,
	computed,
	ConcreteComponent,
	DefineComponent,
	defineComponent,
	FunctionalComponent,
	h,
	PropType,
	VNodeProps,
	watch,
} from "vue";

import { Slice } from "@prismicio/types";

import { simplyResolveComponent } from "../lib/simplyResolveComponent";
import { __PRODUCTION__ } from "../lib/__PRODUCTION__";

/**
 * The minimum required properties to represent a Prismic Slice for the `<SliceZone>` component.
 *
 * If using Prismic's REST API, use the `Slice` export from `@prismicio/types` for a full interface.
 *
 * @typeParam SliceType - Type name of the Slice
 */
export type SliceLike<TSliceType extends string = string> = Pick<
	Slice<TSliceType>,
	"slice_type"
>;

/**
 * A looser version of the `SliceZone` type from `@prismicio/types` using `SliceLike`.
 *
 * If using Prismic's REST API, use the `SliceZone` export from `@prismicio/types` for the full type.
 *
 * @typeParam TSlice - The type(s) of a Slice in the Slice Zone
 */
export type SliceZoneLike<TSlice extends SliceLike> = readonly TSlice[];

/**
 * Vue props for a component rendering content from a Prismic Slice using the `<SliceZone>` component.
 *
 * @typeParam TSlice - The Slice passed as a prop
 * @typeParam TContext - Arbitrary data passed to `<SliceZone>` and made available to all Slice components
 */
export type SliceComponentProps<
	TSlice extends SliceLike = SliceLike,
	TContext = unknown,
> = {
	/** Slice data for this component. */
	slice: TSlice;

	/** The index of the Slice in the Slice Zone. */
	index: number;

	/** All Slices from the Slice Zone to which the Slice belongs. */
	// TODO: We have to keep this list of Slices general due to circular
	// reference limtiations. If we had another generic to determine the full
	// union of Slice types, it would include TSlice. This causes TypeScript to
	// throw a compilation error.
	slices: SliceZoneLike<SliceLike>;

	/** Arbitrary data passed to `<SliceZone>` and made available to all Slice components. */
	context: TContext;
};

// TODO: Write TSDocs
/**
 * @typeParam TSlice - The Slice passed as a prop
 * @typeParam TContext - Arbitrary data passed to `<SliceZone>` and made available to all Slice components
 *
 * @internal
 */
export type DefineComponentSliceComponentProps<
	TSlice extends SliceLike = SliceLike,
	TContext = unknown,
> = {
	slice: {
		type: PropType<SliceComponentProps<TSlice, TContext>["slice"]>;
		required: true;
	};
	index: {
		type: PropType<SliceComponentProps<TSlice, TContext>["index"]>;
		required: true;
	};
	slices: {
		type: PropType<SliceComponentProps<TSlice, TContext>["slices"]>;
		required: true;
	};
	context: {
		type: PropType<SliceComponentProps<TSlice, TContext>["context"]>;
		required: true;
	};
};

// TODO: Write TSDocs
/**
 * Vue props for a component rendering content from a Prismic Slice using the `<SliceZone>` component.
 *
 * @returns Props object to use with {@link defineComponent}
 *
 * @typeParam TSlice - The Slice passed as a prop
 * @typeParam TContext - Arbitrary data passed to `<SliceZone>` and made available to all Slice components
 */
export const getSliceComponentProps = <
	TSlice extends SliceLike = SliceLike,
	TContext = unknown,
>(): DefineComponentSliceComponentProps<TSlice, TContext> => ({
	slice: {
		type: Object as PropType<SliceComponentProps<TSlice, TContext>["slice"]>,
		required: true,
	},
	index: {
		type: Number as PropType<SliceComponentProps<TSlice, TContext>["index"]>,
		required: true,
	},
	slices: {
		type: Array as PropType<SliceComponentProps<TSlice, TContext>["slices"]>,
		required: true,
	},
	context: {
		type: null as unknown as PropType<
			SliceComponentProps<TSlice, TContext>["context"]
		>,
		required: true,
	},
});

/**
 * A Vue component to be rendered for each instance of its Slice.
 *
 * @typeParam TSlice - The type(s) of a Slice in the Slice Zone
 * @typeParam TContext - Arbitrary data made available to all Slice components
 */
export type SliceComponentType<
	TSlice extends SliceLike = SliceLike,
	TContext = unknown,
> =
	| DefineComponent<SliceComponentProps<TSlice, TContext>>
	| FunctionalComponent<SliceComponentProps<TSlice, TContext>>;

/**
 * This Slice component can be used as a reminder to provide a proper implementation.
 *
 * This is also the default React component rendered when a component mapping cannot be found in `<SliceZone>`.
 */
export const TODOSliceComponent = __PRODUCTION__
	? ((() => null) as FunctionalComponent<SliceComponentProps>)
	: (defineComponent({
			name: "TODOSliceCOmponent",
			props: getSliceComponentProps(),
			setup(props) {
				watch(
					props.slice,
					() => {
						console.warn(
							`[SliceZone] Could not find a component for Slice type "${props.slice.slice_type}"`,
							props.slice,
						);
					},
					{ deep: true, immediate: true },
				);

				return () => {
					return h(
						"section",
						{
							dataSliceZoneTodoComponent: "",
							dataSliceType: props.slice.slice_type,
						},
						[
							`Could not find a component for Slice type "${props.slice.slice_type}"`,
						],
					);
				};
			},
	  }) as SliceComponentType);

/**
 * A record of Slice types mapped to a Vue component. The component will be rendered for each instance of its Slice.
 *
 * @typeParam TSlice - The type(s) of a Slice in the Slice Zone
 * @typeParam TContext - Arbitrary data made available to all Slice components
 */
export type SliceZoneComponents<
	TSlice extends SliceLike = SliceLike,
	TContext = unknown,
> =
	// This is purposely not wrapped in Partial to ensure a component is provided
	// for all Slice types. <SliceZone> will render a default component if one is
	// not provided, but it *should* be a type error if an explicit component is
	// missing.
	//
	// If a developer purposely does not want to provide a component, they can
	// assign it to the TODOSliceComponent exported from this package. This
	// signals to future developers that it is a placeholder and should be
	// implemented.
	{
		[SliceType in keyof Record<
			TSlice["slice_type"],
			never
		>]: SliceComponentType<Extract<TSlice, SliceLike<SliceType>>, TContext>;
	};

/**
 * Vue props for the `<SliceZone>` component.
 *
 * @typeParam TSlice - The type(s) of a Slice in the Slice Zone
 * @typeParam TContext - Arbitrary data made available to all Slice components
 */
export type SliceZoneProps<
	TSlice extends SliceLike = SliceLike,
	TContext = unknown,
> = {
	/** List of Slice data from the Slice Zone. */
	slices: SliceZoneLike<TSlice>;

	/** A record mapping Slice types to Vue components. */
	components: SliceZoneComponents;

	/** Arbitrary data made available to all Slice components. */
	context?: TContext;

	/** The React component rendered if a component mapping from the `components` prop cannot be found. */
	defaultComponent?: SliceComponentType<TSlice, TContext>;

	/**
	 * An optional wrapper tag or component to wrap the Slice Zone output. The Slice Zone is not wrapped by default.
	 */
	wrapper?: string | ConcreteComponent | FunctionalComponent;
};

export const SliceZoneImpl = defineComponent({
	name: "SliceZone",
	props: {
		slices: {
			type: Array as PropType<SliceZoneLike<SliceLike>>,
			required: true,
		},
		components: {
			type: Object as PropType<SliceZoneComponents>,
			required: true,
		},
		context: {
			type: null,
			default: undefined,
			required: false,
		},
		defaultComponent: {
			type: Object as PropType<SliceComponentType>,
			default: undefined,
			required: false,
		},
		wrapper: {
			type: [String, Object, Function] as PropType<
				string | ConcreteComponent | FunctionalComponent
			>,
			default: undefined,
			required: false,
		},
	},
	setup(props) {
		// Prevent fatal if user didn't check for field, throws `Invalid prop` warn
		if (!props.slices) {
			return () => null;
		}

		const renderedSlices = computed(() => {
			return props.slices.map((slice, index) => {
				const component =
					slice.slice_type in props.components
						? props.components[slice.slice_type]
						: props.defaultComponent || TODOSliceComponent;

				const p = {
					slice,
					index,
					context: props.context,
					slices: props.slices,
				};

				// This works but is absurd
				// return typeof component === "function"
				// 	? h(component, p)
				// 	: h(component, p);

				return h(component as DefineComponent, p);
			});
		});

		return () => {
			if (props.wrapper) {
				const parent = simplyResolveComponent(props.wrapper);

				// This works but is absurd
				// if (typeof parent === "string") {
				// 	return h(parent, null, renderedSlices.value);
				// } else {
				// 	return h(parent, null, renderedSlices.value);
				// }

				return h(parent as DefineComponent, null, renderedSlices.value);
			} else {
				return renderedSlices.value;
			}
		};
	},
});

// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
export const SliceZone = SliceZoneImpl as unknown as {
	new (): {
		$props: AllowedComponentProps &
			ComponentCustomProps &
			VNodeProps &
			SliceZoneProps;
	};
};
